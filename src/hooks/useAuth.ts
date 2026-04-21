import { resetPassword, signIn, signOut, signUp } from "@/services/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useSignIn() {
    return useMutation({mutationFn: ({email, password}:{email: string; password: string}) => signIn(email, password),});
}

export function useSignUp() {
    return useMutation({mutationFn: ({email, password}:{email: string; password: string}) => signUp(email, password),});
}

export function useSignOut() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: signOut,
        onSuccess: () => queryClient.clear(),
    });
}

export function useResetPassword() {
    return useMutation({mutationFn: (email: string) => resetPassword(email),});
}
