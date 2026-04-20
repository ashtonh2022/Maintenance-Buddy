import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { focusManager, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, usePathname, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { AppState } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

function RefetchOnNavigation() {
  const pathname = usePathname();
  useEffect(() => {
    focusManager.setFocused(true);
  }, [pathname]);
  return null;
}

function RootNavigator() {
  const { session, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    SplashScreen.hideAsync();

    const inAuthGroup = segments[0] === "(auth)";

    if (!session && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (session && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [session, isLoading, segments]);

  if (isLoading) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: true,
        refetchOnMount: "always",
      },
    },
  }));

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (status) => {
      focusManager.setFocused(status === "active");
    });
    return () => subscription.remove();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <RefetchOnNavigation />
            <RootNavigator />
          </QueryClientProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
