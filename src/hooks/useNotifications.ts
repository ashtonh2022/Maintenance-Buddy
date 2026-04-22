import { getNotifications, updateNotifications, getUnreadNotifications, getUnreadNotificationCount, createNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from "@/services/notifications";
import { NotificationRow, NotificationInsert, NotificationUpdate } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useNotifications(userId: string) {
    return useQuery({
        queryKey: ["notifications", userId],
        queryFn: () => getNotifications(userId),
        enabled: !!userId,
    });
}

export function useUnreadNotifications(userId: string) {
    return useQuery({
        queryKey: ["unreadNotifications", userId],
        queryFn: () => getUnreadNotifications(userId),
        enabled: !!userId,
    });
}

export function useUnreadNotificationCount(userId: string) {
    return useQuery({
        queryKey: ["unreadNotificationCount", userId],
        queryFn: () => getUnreadNotificationCount(userId),
        enabled: !!userId,
    });
}

export function useCreateNotifications(userId: string) {
    const queryClient = useQueryClient();
    
        return useMutation({
            mutationFn: async (notification: NotificationInsert): Promise<NotificationRow> => {
                return await createNotifications(notification);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["notifications", userId],
                })
                queryClient.invalidateQueries({
                    queryKey: ["unreadNotifications", userId],
                })
                queryClient.invalidateQueries({
                    queryKey: ["unreadNotificationCount", userId],
                })    
            }
        });
}

export function useUpdateNotification(userId: string) {
    const queryClient = useQueryClient();
    
        return useMutation({
            mutationFn: async ({id, notification}: {id: string; notification: NotificationUpdate;}): Promise<NotificationRow> => {
                return await updateNotifications(id, notification);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["notifications", userId],
                })
            }
        });
}

export function useMarkNotificationAsRead(userId: string) {
    const queryClient = useQueryClient();
    
        return useMutation({
            mutationFn: async (id: string): Promise<NotificationRow> => {
                return await markNotificationAsRead(id);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["notifications", userId],
                })
                queryClient.invalidateQueries({
                    queryKey: ["unreadNotifications", userId],
                })
                queryClient.invalidateQueries({
                    queryKey: ["unreadNotificationCount", userId],
                })    
            }
        });
}

export function useMarkAllNotificationsAsRead(userId: string) {
    const queryClient = useQueryClient();
    
        return useMutation({
            mutationFn: async (): Promise<NotificationRow[]> => {
                return await markAllNotificationsAsRead(userId);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["notifications", userId],
                })
                queryClient.invalidateQueries({
                    queryKey: ["unreadNotifications", userId],
                })
                queryClient.invalidateQueries({
                    queryKey: ["unreadNotificationCount", userId],
                })    
            }
        });
}

export function useDeleteNotification(userId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteNotification(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notification", userId] });
            queryClient.invalidateQueries({ queryKey: ["unreadNotifications", userId] });
            queryClient.invalidateQueries({ queryKey: ["unreadNotificationCount", userId] });
        },
    });
}
