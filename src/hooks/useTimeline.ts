import { addTimelineEntry, deleteTimelineEntry, getTimelineEntry, updateTimelineEntry, getServiceEvents, getAllAppointments, addServiceEvent } from "@/services/timeline";
import { timelineEntryInsert, timelineEntryRow, timelineEntryUpdate } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useTimeline(vehicleId: string) {
    return useQuery({
        queryKey: ["timeline", vehicleId],
        queryFn: () => getTimelineEntry(vehicleId),
        enabled: !!vehicleId,
    });
}

export function useAddServiceEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addServiceEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["serviceEvents"] });
        },
    });
}

export function useServiceEvents(vehicleId: string) {
    return useQuery({
        queryKey: ["serviceEvents", vehicleId],
        queryFn: () => getServiceEvents(vehicleId),
        enabled: !!vehicleId,
    });
}

export function useAddTimelineEntry() {
    const queryClient = useQueryClient();
    
        return useMutation({
            mutationFn: async(timelineEntry: timelineEntryInsert): Promise<timelineEntryRow> => {
                return await addTimelineEntry(timelineEntry);
            },
            onSuccess: (_, variables) => {
                queryClient.invalidateQueries({
                    queryKey: ["timeline", variables.vehicle_id],
                });
                queryClient.invalidateQueries({
                    queryKey: ["serviceEvents", variables.vehicle_id],
                });
            },
        });
}

export function useUpdateTimelineEntry(vehicleId: string) {
    const queryClient = useQueryClient();
    
        return useMutation({
            mutationFn: async ({id, timelineEntry,}: {id: string; timelineEntry: timelineEntryUpdate;}): Promise<timelineEntryRow> => {
                return await updateTimelineEntry(id, timelineEntry);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["timeline", vehicleId],
                })
                queryClient.invalidateQueries({
                    queryKey: ["serviceEvents", vehicleId],
                });
            }
        });
}

export function useDeleteTimelineEntry(vehicleId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async(id: string): Promise<void> => {
            return await deleteTimelineEntry(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["timeline", vehicleId],
            });
            queryClient.invalidateQueries({
                queryKey: ["serviceEvents", vehicleId],
            });
        },
    });
}

export function useAllAppointments() {
    return useQuery({
        queryKey: ["allAppointments"],
        queryFn: getAllAppointments,
    });
}