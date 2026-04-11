import { resetPassword, signIn, signOut, signUp } from "@/services/auth";
import { useMutation } from "@tanstack/react-query";

export function useSignIn() {
    return useMutation({mutationFn: ({email, password}:{email: string; password: string}) => signIn(email, password),});
}

export function useSignUp() {
    return useMutation({mutationFn: ({email, password, mileageRate}:{email: string; password: string; mileageRate: number;}) => signUp(email, password, mileageRate),});
}

export function useSignOut() {
    return useMutation({mutationFn: signOut});
}

export function useResetPassword() {
    return useMutation({mutationFn: (email: string) => resetPassword(email),});
}