// hooks/useVehicles.ts
import { addVehicle, deleteVehicle, getVehicle, getVehicles, updateVehicle } from '@/services/vehicles';
import { VehicleInsert, VehicleUpdate } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useVehicles() {
    return useQuery({
        queryKey: ['vehicles'],
        queryFn: getVehicles,
    });
}

export function useVehicle(id: string) {
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ['vehicle', id],
        queryFn: () => getVehicle(id),
        placeholderData: () => {
            const vehicles = queryClient.getQueryData<any[]>(['vehicles']);
            return vehicles?.find((v) => v.id === id);
        },
    });
}

export function useAddVehicle() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (vehicle: VehicleInsert) => addVehicle(vehicle),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicles'] });
        },
    });
}

export function useUpdateVehicle() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (vehicle: VehicleUpdate) => updateVehicle(vehicle),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["vehicles"] });
            queryClient.invalidateQueries({ queryKey: ["vehicle", variables.id] });
        },
    });
}

export function useDeleteVehicle() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteVehicle(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vehicles"] });
        },
    });
}