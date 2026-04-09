import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout() {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <AuthProvider>
            <QueryClientProvider client={queryClient}>
                <Stack />
            </QueryClientProvider>
        </AuthProvider>
    );
}