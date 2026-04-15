import { resetPassword, saveUserMileage, signIn, signOut, signUp } from "@/services/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useSignIn() {
    return useMutation({mutationFn: ({email, password}:{email: string; password: string}) => signIn(email, password),});
}

export function useSignUp() {
    return useMutation({mutationFn: async({email, password, mileageRate}:{email: string; password: string; mileageRate: number;}) => {
        const signUpData = await signUp(email, password, mileageRate);
        const userId = signUpData.user?.id;
        if (!userId) {
            throw new Error();
        }
        await saveUserMileage(userId, mileageRate)
        return signUpData;
    },});
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