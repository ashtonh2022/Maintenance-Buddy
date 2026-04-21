import { getProfile, updateProfile } from "@/services/profiles";
import { ProfileUpdate } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useProfile(userId: string) {
    return useQuery({
        queryKey: ["profile", userId],
        queryFn: () => getProfile(userId),
        enabled: !!userId,
    });
}

export function useUpdateProfile(userId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (updates: ProfileUpdate) => updateProfile(userId, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile", userId] });
        },
    });
}
