import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addAttachment, getAttachment, deleteAttachment } from "@/services/attachments";

export function useAddAttachment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addAttachment,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["attachments", variables.timeline_entry_id],
            })
        }
    })
}
export function useAttachments(timelineEntryId: string) {
    return useQuery({
        queryKey: ["attachments", timelineEntryId],
        queryFn: () => getAttachment(timelineEntryId),
        enabled: !!timelineEntryId,
    })
}

export function useDeleteAttachments(timelineEntryId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteAttachment,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["attachments", timelineEntryId],
            })
        }
    })
}
