// hooks/useVehicles.ts
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {addVehicle, getVehicle, getVehicles} from '@/services/vehicles';
import {VehicleInsert} from "@/types/types";

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

