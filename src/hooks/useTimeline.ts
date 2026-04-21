import { addTimelineEntry, deleteTimelineEntry, getServiceEvents, updateTimelineEntry, getAppointments, getAllAppointments, getTimelineEntry } from "@/services/timeline";
import { timelineEntryRow, timelineEntryUpdate } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useServiceEvents(vehicleId: string) {
    return useQuery({
        queryKey: ["serviceEvents", vehicleId],
        queryFn: () => getServiceEvents(vehicleId),
        enabled: !!vehicleId,
    });
}

export function useAddServiceEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addTimelineEntry,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["serviceEvents"] });
        },
    });
}

export function useAppointments(vehicleId: string) {
    return useQuery({
        queryKey: ["appointments", vehicleId],
        queryFn: () => getAppointments(vehicleId),
        enabled: !!vehicleId,
    });
}

export function useAddAppointment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addTimelineEntry,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
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
                queryKey: ["serviceEvents", vehicleId],
            });
            queryClient.invalidateQueries({
                queryKey: ["appointments", vehicleId],
            });
        },
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
                queryKey: ["serviceEvents", vehicleId],
            });
            queryClient.invalidateQueries({
                queryKey: ["appointments", vehicleId],
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

export function useTimelineEntry(id: string) {
    return useQuery({
        queryKey: ["timelineEntry", id],
        queryFn: () => getTimelineEntry(id),
        enabled: !!id,
    });
}
