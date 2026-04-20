import { File, Paths, Directory } from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { zip } from "react-native-zip-archive";
import { supabase } from "@/lib/supabase";
import { VehicleRow, timelineEntryRow, AttachmentRow } from "@/types/types";

type VehicleWithTimeline = VehicleRow & {
    timeline_entries?: timelineEntryRow[];
};

//builds TXT file for one vehicle
function buildVehicleSummaryText(vehicle: VehicleWithTimeline) {
    let lines: string[] = [];

    lines.push("Maintenance Buddy Summary Report");
    lines.push("Exported: " + new Date().toLocaleString());
    lines.push("");

    lines.push("Vehicle: " + vehicle.year + " " + vehicle.make + " " + vehicle.model);
    lines.push("Current Mileage: " + (vehicle.recent_mileage ?? "N/A"));
    lines.push("");

    let services = vehicle.timeline_entries;
    if (!services) {
        services = [];
    }

    if (services.length === 0) {
        lines.push("No service history found.");
        return lines.join("\n");
    }

    const sorted = [...services].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    const last30 = sorted.slice(0, 30);

    for (let i = 0; i < last30.length; i++) {
        const s = last30[i];

        lines.push("Service " + (i + 1));
        lines.push("Date: " + s.date);
        lines.push("Service Type: " + s.service_type);
        lines.push("Mileage: " + (s.mileage_at_service ?? "N/A"));
        lines.push("Mechanic Shop: " + (s.mechanic_shop ?? "N/A"));
        lines.push("Completed: " + (s.is_completed ? "Yes" : "No"));
        lines.push("Description: " + (s.description ?? "N/A"));
        lines.push("");
    }
    return lines.join("\n");
}

//builds TXT file for all vehicles
function buildAllVehiclesSummaryText(vehicles: VehicleWithTimeline[]) {
    let lines: string[] = [];

    lines.push("Maintenance Buddy Summary Report");
    lines.push("Exported: " + new Date().toLocaleString());
    lines.push("Total Vehicles: " + vehicles.length);
    lines.push("");

    if (vehicles.length === 0) {
        lines.push("No vehicles found.");
        return lines.join("\n");
    }

    for (let i = 0; i < vehicles.length; i++) {
        const v = vehicles[i];

        lines.push("Vehicle " + (i + 1));
        lines.push(buildVehicleSummaryText(v));
        lines.push("");
    }
    return lines.join("\n");
}

//file name for TXT file
function makeFileName(vehicle: VehicleWithTimeline) {
    let name = vehicle.year + "-" + vehicle.make + "-" + vehicle.model + "-summary.txt";
    name = name.replace(/\s+/g, "-").toLowerCase();
    return name;
}

//shares TXT file to user
async function saveAndShare(fileName: string, content: string) {
    const file = new File(Paths.cache, fileName);
    file.write(content);
    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) {
        throw new Error("Sharing not available");
    }
    await Sharing.shareAsync(file.uri);
}

//function for TXT file for all vehicles
export async function exportSummaryTxtAllVehicles(userId: string) {
    const { data, error } = await supabase
        .from("vehicles")
        .select(`*, timeline_entries (*)`)
        .eq("user_id", userId);
    if (error) {
        throw error;
    }
    const vehicles = (data ?? []) as VehicleWithTimeline[];

    const text = buildAllVehiclesSummaryText(vehicles);

    await saveAndShare("all-vehicles-summary.txt", text);
}

//function for TXT file for one vehicle
export async function exportSummaryTxtVehicle(vehicleId: string) {
    const { data, error } = await supabase
        .from("vehicles")
        .select(`*, timeline_entries (*)`)
        .eq("id", vehicleId)
        .single();
    if (error) {
        throw error;
    }

    const vehicle = data as VehicleWithTimeline;

    const text = buildVehicleSummaryText(vehicle);
    const fileName = makeFileName(vehicle);

    await saveAndShare(fileName, text);
}

//builds pdf file for all vehicles
function buildAllVehiclesSummaryPdf(vehicles: VehicleWithTimeline[]) {
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
        html += buildVehicleSummaryPdf(vehicles[i]);
    }

    html += "</body></html>";

    return html;
}

//builds pdf file for one vehicle
function buildVehicleSummaryPdf(vehicle: VehicleWithTimeline) {
    let html = "";

    html += "<h2>" + vehicle.year + " " + vehicle.make + " " + vehicle.model + "</h2>";
    html += "<p>Current Mileage: " + (vehicle.recent_mileage ?? "N/A") + "</p>";

    let services = vehicle.timeline_entries;
    if (!services) {
        services = [];
    }

    if (services.length === 0) {
        html += "<p>No service history found.</p>";
        html += "</body></html>";
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
    }

    html += "</body></html>";

    return html;
}

//shares pdf file to user
async function saveAndSharePdf(fileName: string, html: string) {
    const { uri } = await Print.printToFileAsync({
        html: html,
    });

    const canShare = await Sharing.isAvailableAsync();

    if (!canShare) {
        throw new Error("Sharing not available");
    }

    await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: fileName,
        UTI: "com.adobe.pdf",
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
        .select(`*, timeline_entries (*)`)
        .eq("user_id", userId);

    if (error) {
        throw error;
    }

    const vehicles = (data ?? []) as VehicleWithTimeline[];

    const html = buildAllVehiclesSummaryPdf(vehicles);

    await saveAndSharePdf("all-vehicles-summary.pdf", html);
}

//pdf function for one vehicle
export async function exportSummaryPdfVehicle(vehicleId: string) {
    const { data, error } = await supabase
        .from("vehicles")
        .select(`*, timeline_entries (*)`)
        .eq("id", vehicleId)
        .single();
    if (error) {
        throw error;
    }

    const vehicle = data as VehicleWithTimeline;

    const pdf = buildVehicleSummaryPdf(vehicle);
    const fileName = makePdfFileName(vehicle);

    await saveAndSharePdf(fileName, pdf);
}

//builds docx file for one vehicle
function buildVehicleSummaryDocx(vehicle: VehicleWithTimeline) {
    const children: Paragraph[] = [];

    children.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: "Maintenance Buddy Summary Report",
                    bold: true,
                }),
            ],
        })
    );

    children.push(
        new Paragraph("Exported: " + new Date().toLocaleString())
    );

    children.push(new Paragraph(""));

    children.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: "Vehicle: " + vehicle.year + " " + vehicle.make + " " + vehicle.model,
                    bold: true,
                }),
            ],
        })
    );

    children.push(
        new Paragraph("Current Mileage: " + (vehicle.recent_mileage ?? "N/A"))
    );

    children.push(new Paragraph(""));

    let services = vehicle.timeline_entries;
    if (!services) {
        services = [];
    }

    if (services.length === 0) {
        children.push(new Paragraph("No service history found."));
    } else {
        const sorted = [...services].sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        const last30 = sorted.slice(0, 30);

        for (let i = 0; i < last30.length; i++) {
            const s = last30[i];

            children.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "Service " + (i + 1),
                            bold: true,
                        }),
                    ],
                })
            );

            children.push(new Paragraph("Date: " + s.date));
            children.push(new Paragraph("Service Type: " + s.service_type));
            children.push(new Paragraph("Mileage: " + (s.mileage_at_service ?? "N/A")));
            children.push(new Paragraph("Mechanic Shop: " + (s.mechanic_shop ?? "N/A")));
            children.push(new Paragraph("Completed: " + (s.is_completed ? "Yes" : "No")));
            children.push(new Paragraph("Description: " + (s.description ?? "N/A")));
            children.push(new Paragraph(""));
        }
    }

    const doc = new Document({
        sections: [
            {
                children: children,
            },
        ],
    });

    return doc;
}

//builds docx file for all vehicles
function buildAllVehiclesSummaryDocx(vehicles: VehicleWithTimeline[]) {
    const children: Paragraph[] = [];

    children.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: "Maintenance Buddy Summary Report",
                    bold: true,
                }),
            ],
        })
    );

    children.push(new Paragraph("Exported: " + new Date().toLocaleString()));
    children.push(new Paragraph("Total Vehicles: " + vehicles.length));
    children.push(new Paragraph(""));

    if (vehicles.length === 0) {
        children.push(new Paragraph("No vehicles found."));
    } else {
        for (let i = 0; i < vehicles.length; i++) {
            const vehicle = vehicles[i];

            children.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "Vehicle " + (i + 1),
                            bold: true,
                        }),
                    ],
                })
            );

            children.push(
                new Paragraph(vehicle.year + " " + vehicle.make + " " + vehicle.model)
            );

            children.push(
                new Paragraph("Current Mileage: " + (vehicle.recent_mileage ?? "N/A"))
            );

            children.push(new Paragraph(""));

            let services = vehicle.timeline_entries;
            if (!services) {
                services = [];
            }

            if (services.length === 0) {
                children.push(new Paragraph("No service history found."));
                children.push(new Paragraph(""));
            } else {
                const sorted = [...services].sort((a, b) => {
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                });

                const last30 = sorted.slice(0, 30);

                for (let j = 0; j < last30.length; j++) {
                    const s = last30[j];

                    children.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Service " + (j + 1),
                                    bold: true,
                                }),
                            ],
                        })
                    );

                    children.push(new Paragraph("Date: " + s.date));
                    children.push(new Paragraph("Service Type: " + s.service_type));
                    children.push(new Paragraph("Mileage: " + (s.mileage_at_service ?? "N/A")));
                    children.push(new Paragraph("Mechanic Shop: " + (s.mechanic_shop ?? "N/A")));
                    children.push(new Paragraph("Completed: " + (s.is_completed ? "Yes" : "No")));
                    children.push(new Paragraph("Description: " + (s.description ?? "N/A")));
                    children.push(new Paragraph(""));
                }
            }
        }
    }

    const doc = new Document({
        sections: [
            {
                children: children,
            },
        ],
    });

    return doc;
}

//shares docx to user
async function saveAndShareDocx(fileName: string, doc: Document) {
    const arrayBuffer = await Packer.toArrayBuffer(doc);

    const file = new File(Paths.cache, fileName);
    file.write(new Uint8Array(arrayBuffer));

    const canShare = await Sharing.isAvailableAsync();

    if (!canShare) {
        throw new Error("Sharing not available");
    }

    await Sharing.shareAsync(file.uri, {
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        dialogTitle: fileName,
        UTI: "org.openxmlformats.wordprocessingml.document",
    });
}

//docx file name
function makeDocxFileName(vehicle: VehicleWithTimeline) {
    let fileName = vehicle.year + "-" + vehicle.make + "-" + vehicle.model + "-summary.docx";
    fileName = fileName.replace(/\s+/g, "-").toLowerCase();
    return fileName;
}

//docx function for all vehicles
export async function exportSummaryDocxAllVehicles(userId: string) {
    const { data, error } = await supabase
        .from("vehicles")
        .select(`*, timeline_entries (*)`)
        .eq("user_id", userId);

    if (error) {
        throw error;
    }

    const vehicles = (data ?? []) as VehicleWithTimeline[];

    const docx = buildAllVehiclesSummaryDocx(vehicles);

    await saveAndShareDocx("all-vehicles-summary.docx", docx);
}

//docx function for one vehicle
export async function exportSummaryDocxVehicle(vehicleId: string) {
    const { data, error } = await supabase
        .from("vehicles")
        .select(`*, timeline_entries (*)`)
        .eq("id", vehicleId)
        .single();
    if (error) {
        throw error;
    }

    const vehicle = data as VehicleWithTimeline;

    const docx = buildVehicleSummaryDocx(vehicle);
    const fileName = makeDocxFileName(vehicle);

    await saveAndShareDocx(fileName, docx);
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

async function downloadAttachmentToFile(attachment: AttachmentRow, folder: Directory, index: number) {
    const result = await supabase.storage
        .from(ATTACHMENTS_BUCKET)
        .download(attachment.file_path);

    const data = result.data;
    const error = result.error;

    if (error) {
        throw error;
    }

    if (!data) {
        throw new Error("Attachment download returned no data.");
    }

    const arrayBuffer = await data.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    let fileName = attachment.file_path.split("/").pop() ?? ("attachment-" + index);
    fileName = makeSafeName(fileName);

    if (!fileName.includes(".")) {
        const extension = getExtensionFromPath(attachment.file_path);
        fileName = fileName + extension;
    }

    const file = new File(folder, fileName);
    file.write(bytes);

    return {
        originalPath: attachment.file_path,
        localName: fileName,
        localUri: file.uri,
        fileType: attachment.file_type,
        fileSize: attachment.file_size,
    };
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

    const folderName =
        vehicle.year + "-" + vehicle.make + "-" + vehicle.model + "-full-export";

    const folderName2 = folderName.replace(/\s+/g, "-").toLowerCase();

    const exportFolder = new Directory(Paths.cache, folderName2);
    exportFolder.create({
        idempotent: true,
        intermediates: true,
    });

    const summaryFile = new File(exportFolder, "summary.txt");
    const summaryText = buildVehicleSummaryText(vehicle);
    summaryFile.write(summaryText);

    const vehicleFile = new File(exportFolder, "vehicle.json");
    const vehicleJson = JSON.stringify(vehicle, null, 2);
    vehicleFile.write(vehicleJson);

    let services = vehicle.timeline_entries;
    if (!services) {
        services = [];
    }

    const servicesFile = new File(exportFolder, "services.json");
    const servicesJson = JSON.stringify(services, null, 2);
    servicesFile.write(servicesJson);

    const attachmentsFolder = new Directory(exportFolder, "attachments");
    attachmentsFolder.create({
        idempotent: true,
        intermediates: true,
    });

    const list: {
        serviceId: string;
        filePath: string;
        fileType: string;
        fileSize: number;
        localName?: string;
        localUri?: string;
        downloadFailed?: boolean;
    }[] = [];

    let attachmentIndex = 0;

    for (let i = 0; i < services.length; i++) {
        const service = services[i];
        const serviceAttachments = service.attachments ?? [];

        for (let j = 0; j < serviceAttachments.length; j++) {
            const attachment = serviceAttachments[j];

            try {
                const savedFile = await downloadAttachmentToFile(
                    attachment,
                    attachmentsFolder,
                    attachmentIndex
                );

                list.push({
                    serviceId: service.id,
                    filePath: attachment.file_path,
                    fileType: attachment.file_type,
                    fileSize: attachment.file_size,
                    localName: savedFile.localName,
                    localUri: savedFile.localUri,
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

    const attachmentsFile = new File(exportFolder, "attachments.json");
    const attachmentsJson = JSON.stringify(list, null, 2);
    attachmentsFile.write(attachmentsJson);

    const zipFileName = makeZipFileName(vehicle);
    const zipTarget = new File(Paths.cache, zipFileName);

    const zipPath = await zip(exportFolder.uri, zipTarget.uri);

    const canShare = await Sharing.isAvailableAsync();

    if (!canShare) {
        throw new Error("Sharing not available");
    }

    await Sharing.shareAsync(zipPath, {
        mimeType: "application/zip",
        dialogTitle: zipFileName,
        UTI: "public.zip-archive",
    });
}