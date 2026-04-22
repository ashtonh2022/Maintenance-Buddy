import { File, Paths, Directory } from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import { Document, Packer, Paragraph, TextRun, ImageRun } from "docx";
import { zip } from "react-native-zip-archive";
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

//shares pdf file to user
async function saveAndSharePdf(fileName: string, html: string) {
    const { uri } = await Print.printToFileAsync({
        html: html,
    });

    const pdfBytes = new Uint8Array(await new File(uri).arrayBuffer());
    const outputFile = new File(Paths.cache, fileName);
    outputFile.write(pdfBytes);

    const canShare = await Sharing.isAvailableAsync();

    if (!canShare) {
        throw new Error("Sharing not available");
    }

    await Sharing.shareAsync(outputFile.uri, {
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

function getDocxImageType(fileType?: string): "png" | "jpg" | "jpeg" | "gif" | "bmp" {
    if (fileType === "image/png") return "png";
    if (fileType === "image/gif") return "gif";
    if (fileType === "image/bmp") return "bmp";
    if (fileType === "image/jpeg") return "jpeg";
    if (fileType === "image/jpg") return "jpg";
    return "png";
}

//builds docx file for one vehicle
async function buildVehicleSummaryDocx(vehicle: VehicleWithTimeline) {
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

            const attachments = s.attachments ?? [];

            if (attachments.length > 0) {
                children.push(new Paragraph("Attachments:"));

                for (let j = 0; j < attachments.length; j++) {
                    const a = attachments[j];

                    try {
                        const result = await supabase.storage
                            .from("attachments")
                            .download(a.file_path);

                        if (result.data) {
                            const buffer = await result.data.arrayBuffer();
                            const imageBytes = new Uint8Array(buffer);

                            if (isImage(a.file_type)) {
                                children.push(
                                    new Paragraph({
                                        children: [
                                            new ImageRun({
                                                data: imageBytes,
                                                transformation: {
                                                    width: 200,
                                                    height: 200,
                                                },
                                                type: getDocxImageType(a.file_type),
                                            } as any),
                                        ],
                                    })
                                );
                            } else {
                                children.push(
                                    new Paragraph(
                                        "File: " + getFileName(a.file_path) + " (" + a.file_type + ")"
                                    )
                                );
                            }
                        }
                    } catch {
                        children.push(new Paragraph("Failed to load attachment"));
                    }
                }
                children.push(new Paragraph(""));
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

//builds docx file for all vehicles
async function buildAllVehiclesSummaryDocx(vehicles: VehicleWithTimeline[]) {
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

                    const attachments = s.attachments ?? [];

                    if (attachments.length > 0) {
                        children.push(new Paragraph("Attachments:"));

                        for (let k = 0; k < attachments.length; k++) {
                            const a = attachments[k];

                            try {
                                const result = await supabase.storage
                                .from("attachments")
                                .download(a.file_path);

                                if (result.data) {
                                    const buffer = await result.data.arrayBuffer();
                                    const imageBytes = new Uint8Array(buffer);

                                    if (isImage(a.file_type)) {
                                        children.push(
                                            new Paragraph({
                                                children: [
                                                    new ImageRun({
                                                        data: imageBytes,
                                                        transformation: {
                                                            width: 200,
                                                            height: 200,
                                                        },
                                                        type: getDocxImageType(a.file_type),
                                                    } as any),
                                                ],
                                            })
                                        );
                                    } else {
                                        children.push(
                                            new Paragraph(
                                                "File: " + getFileName(a.file_path) + " (" + a.file_type + ")"
                                            )
                                        );
                                    }
                                }
                            } catch {
                                children.push(new Paragraph("Failed to load attachment"));
                            }
                        }
                        children.push(new Paragraph(""));
                    }
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
        .select(`*, timeline_entries (*, attachments (*))`)
        .eq("user_id", userId);

    if (error) {
        throw error;
    }

    const vehicles = (data ?? []) as VehicleWithTimeline[];

    const docx = await buildAllVehiclesSummaryDocx(vehicles);

    await saveAndShareDocx("all-vehicles-summary.docx", docx);
}

//docx function for one vehicle
export async function exportSummaryDocxVehicle(vehicleId: string) {
    const { data, error } = await supabase
        .from("vehicles")
        .select(`*, timeline_entries (*, attachments (*))`)
        .eq("id", vehicleId)
        .single();
    if (error) {
        throw error;
    }

    const vehicle = data as VehicleWithTimeline;

    const docx = await buildVehicleSummaryDocx(vehicle);
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