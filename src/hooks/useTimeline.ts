import { addtimelineEntry, deletetimelineEntry, gettimelineEntry, updatetimelineEntry } from "@/services/timeline";
import { timelineEntryInsert, timelineEntryRow, timelineEntryUpdate } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useTimeline(vehicleId: string) {
    return useQuery({
        queryKey: ["timeline", vehicleId],
        queryFn: () => gettimelineEntry(vehicleId),
        enabled: !!vehicleId,
    });
}

export function useaddtimelineEntry() {
    const queryClient = useQueryClient();
    
        return useMutation({
            mutationFn: async(timelineEntry: timelineEntryInsert): Promise<timelineEntryRow> => {
                return await addtimelineEntry(timelineEntry);
            },
            onSuccess: (_, variables) => {
                queryClient.invalidateQueries({
                    queryKey: ["timeline", variables.vehicle_id],
                });
            },
        });
}

export function useupdatetimelineEntry(vehicleId: string) {
    const queryClient = useQueryClient();
    
        return useMutation({
            mutationFn: async ({id, timelineEntry,}: {id: string; timelineEntry: timelineEntryUpdate;}): Promise<timelineEntryRow> => {
                return await updatetimelineEntry(id, timelineEntry);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["timeline", vehicleId],
                })
            }
        });
}

export function usedeletetimelineEntry(vehicleId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async(id: string): Promise<void> => {
            return await deletetimelineEntry(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["timeline", vehicleId],
            });
        },
    });
}