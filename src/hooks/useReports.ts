import { useMutation } from "@tanstack/react-query";
import {exportSummaryTxtAllVehicles, exportSummaryPdfAllVehicles, exportSummaryDocxAllVehicles, exportSummaryTxtVehicle, exportSummaryPdfVehicle, exportSummaryDocxVehicle, exportVehicleFullZip } from "@/services/exportHistory";

export function useExportTxtAllVehicles() {
  return useMutation({
    mutationFn: (userId: string) => exportSummaryTxtAllVehicles(userId),
  });
}

export function useExportPdfAllVehicles() {
  return useMutation({
    mutationFn: (userId: string) => exportSummaryPdfAllVehicles(userId),
  });
}

export function useExportDocxAllVehicles() {
  return useMutation({
    mutationFn: (userId: string) => exportSummaryDocxAllVehicles(userId),
  });
}

export function useExportSummaryTxtVehicle() {
  return useMutation({
    mutationFn: (vehicleId: string) => exportSummaryTxtVehicle(vehicleId),
  });
}

export function useExportSummaryPdfVehicle() {
  return useMutation({
    mutationFn: (vehicleId: string) => exportSummaryPdfVehicle(vehicleId),
  });
}

export function useExportSummaryDocxVehicle() {
  return useMutation({
    mutationFn: (vehicleId: string) => exportSummaryDocxVehicle(vehicleId),
  });
}

export function useExportVehicleFullZip() {
  return useMutation({
    mutationFn: (vehicleId: string) => exportVehicleFullZip(vehicleId),
  });
}