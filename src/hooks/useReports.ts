import { useMutation } from "@tanstack/react-query";
import { exportSummaryPdfAllVehicles, exportSummaryPdfVehicle, exportVehicleFullZip } from "@/services/exportHistory";

export function useExportPdfAllVehicles() {
  return useMutation({
    mutationFn: (userId: string) => exportSummaryPdfAllVehicles(userId),
  });
}

export function useExportSummaryPdfVehicle() {
  return useMutation({
    mutationFn: (vehicleId: string) => exportSummaryPdfVehicle(vehicleId),
  });
}

export function useExportVehicleFullZip() {
  return useMutation({
    mutationFn: (vehicleId: string) => exportVehicleFullZip(vehicleId),
  });
}