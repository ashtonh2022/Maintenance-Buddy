import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
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

type TimelineEntryWithAttachments = timelineEntryRow & {
  attachments?: AttachmentRow[];
};

type VehicleWithTimeline = VehicleRow & {
  timeline_entries?: TimelineEntryWithAttachments[];
};

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

async function saveAndSharePdf(fileName: string, html: string) {
  const { uri } = await Print.printToFileAsync({
    html,
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
  });
}

function makePdfFileName(vehicle: VehicleWithTimeline) {
  let fileName =
    vehicle.year + "-" + vehicle.make + "-" + vehicle.model + "-summary.pdf";
  fileName = fileName.replace(/\s+/g, "-").toLowerCase();
  return fileName;
}

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

function makeExportFileName(vehicle: VehicleWithTimeline) {
  let name =
    vehicle.year + "-" + vehicle.make + "-" + vehicle.model + "-full-export.json";
  name = name.replace(/\s+/g, "-").toLowerCase();
  return name;
}

export async function exportVehicleFullZip(vehicleId: string) {
  const { data, error } = await supabase
    .from("vehicles")
    .select(`*, timeline_entries (*, attachments (*))`)
    .eq("id", vehicleId)
    .single();

  if (error) {
    throw error;
  }

  const vehicle = data as VehicleWithTimeline;
  const services = vehicle.timeline_entries ?? [];

  const exportPayload = {
    exportedAt: new Date().toISOString(),
    note: "Expo-safe full export fallback. ZIP packaging is disabled in this build.",
    vehicle: {
      id: vehicle.id,
      year: vehicle.year,
      make: vehicle.make,
      model: vehicle.model,
      recent_mileage: vehicle.recent_mileage ?? null,
    },
    timeline_entries: services.map((service) => ({
      ...service,
      attachments: (service.attachments ?? []).map((attachment) => ({
        id: attachment.id,
        file_path: attachment.file_path,
        file_name: getFileName(attachment.file_path),
        file_type: attachment.file_type,
        file_size: attachment.file_size,
      })),
    })),
  };

  const fileName = makeExportFileName(vehicle);
  const file = new File(Paths.cache, fileName);
  file.write(JSON.stringify(exportPayload, null, 2));

  const canShare = await Sharing.isAvailableAsync();

  if (!canShare) {
    throw new Error("Sharing not available");
  }

  await Sharing.shareAsync(file.uri, {
    mimeType: "application/json",
    dialogTitle: fileName,
  });
}