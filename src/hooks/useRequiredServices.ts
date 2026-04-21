import { getRequiredServices, updateRequiredService } from "@/services/schedules";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useRequiredServices(vehicleId: string) {
    return useQuery({
        queryKey: ["requiredServices", vehicleId],
        queryFn: () => getRequiredServices(vehicleId),
        enabled: !!vehicleId,
    });
}

export function useUpdateRequiredService(vehicleId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: { interval_miles?: number; enabled?: boolean } }) =>
            updateRequiredService(id, updates),
        onMutate: async ({ id, updates }) => {
            await queryClient.cancelQueries({ queryKey: ["requiredServices", vehicleId] });
            const previous = queryClient.getQueryData(["requiredServices", vehicleId]);
            queryClient.setQueryData(["requiredServices", vehicleId], (old: any[]) =>
                old?.map(s => s.id === id ? { ...s, ...updates } : s)
            );
            return { previous };
        },
        onError: (_err, _vars, context) => {
            queryClient.setQueryData(["requiredServices", vehicleId], context?.previous);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["requiredServices", vehicleId] });
        },
    });
}
