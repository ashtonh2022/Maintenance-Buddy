import { File, Paths } from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import JSZip from "jszip";
import { supabase } from "@/lib/supabase";
import { VehicleRow, timelineEntryRow, AttachmentRow } from "@/types/types";

function isImage(fileType?: string) {
    return fileType?.startsWith("image/");
}

function getFileName(path: string) {
    let name = path.split("/").pop() || "file";
    name = name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    return name;
}

type VehicleWithTimeline = VehicleRow & {
    timeline_entries?: TimelineEntryWithAttachments[];
};

type TimelineEntryWithAttachments = timelineEntryRow & {
    attachments?: AttachmentRow[];
};

//builds pdf file for all vehicles
async function buildAllVehiclesSummaryPdf(vehicles: VehicleWithTimeline[]) {
    let html = "";

    html += "<html><body>";
    html += "<h1>Maintenance Buddy Summary Report</h1>";
    html += "<p>Exported: " + new Date().toLocaleString() + "</p>";
    html += "<p>Total Vehicles: " + vehicles.length + "</p>";

    if (vehicles.length === 0) {
        html += "<p>No vehicles found.</p>";
        html += "</body></html>";
        return html;
    }

    for (let i = 0; i < vehicles.length; i++) {
        html += "<hr>";
        html += await buildVehicleSummaryPdf(vehicles[i]);
    }
    html += "</body></html>";
    return html;
}

//builds pdf file for one vehicle
async function buildVehicleSummaryPdf(vehicle: VehicleWithTimeline) {
    let html = "";

    html += "<h2>" + vehicle.year + " " + vehicle.make + " " + vehicle.model + "</h2>";
    html += "<p>Current Mileage: " + (vehicle.recent_mileage ?? "N/A") + "</p>";

    let services = vehicle.timeline_entries;
    if (!services) {
        services = [];
    }

    if (services.length === 0) {
        html += "<p>No service history found.</p>";
        return html;
    }

    const sorted = [...services].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    const last30 = sorted.slice(0, 30);

    for (let i = 0; i < last30.length; i++) {
        const service = last30[i];

        html += "<hr>";
        html += "<p><b>Service " + (i + 1) + "</b></p>";
        html += "<p>Date: " + service.date + "</p>";
        html += "<p>Service Type: " + service.service_type + "</p>";
        html += "<p>Mileage: " + (service.mileage_at_service ?? "N/A") + "</p>";
        html += "<p>Mechanic Shop: " + (service.mechanic_shop ?? "N/A") + "</p>";
        html += "<p>Completed: " + (service.is_completed ? "Yes" : "No") + "</p>";
        html += "<p>Description: " + (service.description ?? "N/A") + "</p>";

        const attachments = service.attachments ?? [];

        if (attachments.length > 0) {
            html += "<p><b>Attachments:</b></p>";

            for (let j = 0; j < attachments.length; j++) {
            const a = attachments[j];

                if (isImage(a.file_type)) {
                    const { data } = await supabase.storage
                        .from("attachments")
                        .createSignedUrl(a.file_path, 300);

                    if (data?.signedUrl) {
                        html += `<img src="${data.signedUrl}" style="width:200px;margin-bottom:10px;" />`;
                    }
                } else {
                    html += `<p>File: ${getFileName(a.file_path)} (${a.file_type})</p>`;
                }
            }
        }
    }
    return html;
}

//saves pdf file to cache then opens share sheet
async function saveAndSharePdf(fileName: string, html: string) {
    const { uri } = await Print.printToFileAsync({
        html: html,
    });

    const pdfBytes = new Uint8Array(await new File(uri).arrayBuffer());
    const outputFile = new File(Paths.cache, fileName);
    outputFile.write(pdfBytes);

    await shareFile(outputFile.uri, "application/pdf");
}

//opens share sheet - expo-sharing handles content URI conversion
async function shareFile(fileUri: string, mimeType: string) {
    await Sharing.shareAsync(fileUri, {
        mimeType,
        UTI: mimeType === "application/pdf" ? "com.adobe.pdf" : "public.zip-archive",
    });
}

//file name for pdf
function makePdfFileName(vehicle: VehicleWithTimeline) {
    let fileName = vehicle.year + "-" + vehicle.make + "-" + vehicle.model + "-summary.pdf";
    fileName = fileName.replace(/\s+/g, "-").toLowerCase();
    return fileName;
}

//pdf function for all vehicles
export async function exportSummaryPdfAllVehicles(userId: string) {
    const { data, error } = await supabase
        .from("vehicles")
        .select(`*, timeline_entries (*, attachments (*))`)
        .eq("user_id", userId);

    if (error) {
        throw error;
    }

    const vehicles = (data ?? []) as VehicleWithTimeline[];

    const html = await buildAllVehiclesSummaryPdf(vehicles);

    await saveAndSharePdf("all-vehicles-summary.pdf", html);
}

//pdf function for one vehicle
export async function exportSummaryPdfVehicle(vehicleId: string) {
    const { data, error } = await supabase
        .from("vehicles")
        .select(`*, timeline_entries (*, attachments (*))`)
        .eq("id", vehicleId)
        .single();
    if (error) {
        throw error;
    }

    const vehicle = data as VehicleWithTimeline;

    const content = await buildVehicleSummaryPdf(vehicle);
    const pdf =
        "<html><body>" +
        "<h1>Maintenance Buddy Summary Report</h1>" +
        "<p>Exported: " + new Date().toLocaleString() + "</p>" +
        content +
        "</body></html>";

    const fileName = makePdfFileName(vehicle);

    await saveAndSharePdf(fileName, pdf);
}

//file name for zip
function makeZipFileName(vehicle: VehicleWithTimeline) {
    let name = vehicle.year + "-" + vehicle.make + "-" + vehicle.model + "-full-export.zip";
    name = name.replace(/\s+/g, "-").toLowerCase();
    return name;
}

const ATTACHMENTS_BUCKET = "attachments";

function makeSafeName(name: string) {
    return name.replace(/[^\w.-]/g, "_");
}

function getExtensionFromPath(path: string) {
    const parts = path.split(".");

    if (parts.length > 1) {
        const lastPart = parts[parts.length - 1];
        return "." + lastPart;
    }

    return "";
}


export async function exportVehicleFullZip(vehicleId: string) {
    const result = await supabase
        .from("vehicles")
        .select(`*, timeline_entries ( *, attachments (*))`)
        .eq("id", vehicleId)
        .single();

    const data = result.data;
    const error = result.error;

    if (error) {
        throw error;
    }

    const vehicle = data as VehicleWithTimeline & {
        timeline_entries?: (timelineEntryRow & {
            attachments?: AttachmentRow[];
        })[];
    };

    let services = vehicle.timeline_entries;
    if (!services) {
        services = [];
    }

    const jszip = new JSZip();

    jszip.file("vehicle.json", JSON.stringify(vehicle, null, 2));
    jszip.file("services.json", JSON.stringify(services, null, 2));

    const attachmentsFolder = jszip.folder("attachments");

    const list: {
        serviceId: string;
        filePath: string;
        fileType: string;
        fileSize: number;
        localName?: string;
        downloadFailed?: boolean;
    }[] = [];

    let attachmentIndex = 0;

    for (let i = 0; i < services.length; i++) {
        const service = services[i];
        const serviceAttachments = service.attachments ?? [];

        for (let j = 0; j < serviceAttachments.length; j++) {
            const attachment = serviceAttachments[j];

            try {
                const downloadResult = await supabase.storage
                    .from(ATTACHMENTS_BUCKET)
                    .download(attachment.file_path);

                if (downloadResult.error || !downloadResult.data) {
                    throw downloadResult.error ?? new Error("No data");
                }

                const arrayBuffer = await downloadResult.data.arrayBuffer();
                const bytes = new Uint8Array(arrayBuffer);

                let fileName = attachment.file_path.split("/").pop() ?? ("attachment-" + attachmentIndex);
                fileName = makeSafeName(fileName);

                if (!fileName.includes(".")) {
                    fileName = fileName + getExtensionFromPath(attachment.file_path);
                }

                attachmentsFolder!.file(fileName, bytes);

                list.push({
                    serviceId: service.id,
                    filePath: attachment.file_path,
                    fileType: attachment.file_type,
                    fileSize: attachment.file_size,
                    localName: fileName,
                });
            } catch {
                list.push({
                    serviceId: service.id,
                    filePath: attachment.file_path,
                    fileType: attachment.file_type,
                    fileSize: attachment.file_size,
                    downloadFailed: true,
                });
            }

            attachmentIndex++;
        }
    }

    jszip.file("attachments.json", JSON.stringify(list, null, 2));

    const zipBytes = await jszip.generateAsync({ type: "uint8array" });

    const zipFileName = makeZipFileName(vehicle);
    const zipFile = new File(Paths.cache, zipFileName);
    zipFile.write(zipBytes);

    await shareFile(zipFile.uri, "application/zip");
}