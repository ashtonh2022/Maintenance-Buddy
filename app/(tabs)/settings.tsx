import { useAuth } from "@/contexts/AuthContext";
import { useSignOut, useResetPassword } from "@/hooks/useAuth";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { router } from "expo-router";
import React from "react";
import { Alert, Pressable, StyleSheet, Switch, Text, View } from "react-native";


export default function Settings() {
    const { session } = useAuth();
    const userId = session?.user?.id ?? "";
    const userEmail = session?.user?.email ?? "";

    const { data: profile } = useProfile(userId);
    const updateProfile = useUpdateProfile(userId);
    const signOutMutation = useSignOut();
    const resetPasswordMutation = useResetPassword();

    const handleSignOut = async () => {
        try {
            await signOutMutation.mutateAsync();
            router.replace("/(auth)/login");
        } catch (error: any) {
            Alert.alert("Sign Out Failed", error.message || "Something went wrong");
        }
    };

    const handleChangePassword = async () => {
        try {
            await resetPasswordMutation.mutateAsync(userEmail);
            Alert.alert("Email Sent", "Check your inbox for a password reset link.");
        } catch (error: any) {
            Alert.alert("Error", error.message || "Something went wrong");
        }
    };

    const toggleNotifications = () => {
        updateProfile.mutate({ notifications_enabled: !profile?.notifications_enabled } as any);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account</Text>
                <Text style={styles.email}>{userEmail}</Text>
                <Pressable style={styles.button} onPress={handleChangePassword}>
                    <Text style={styles.buttonText}>
                        {resetPasswordMutation.isPending ? "Sending..." : "Change Password"}
                    </Text>
                </Pressable>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Preferences</Text>

                <Text style={styles.settingLabel}>Units</Text>
                <View style={styles.unitRow}>
                    <Pressable
                        style={[styles.unitOption, profile?.units === "imperial" && styles.unitOptionSelected]}
                        onPress={() => updateProfile.mutate({ units: "imperial" } as any)}
                    >
                        <Text style={profile?.units === "imperial" ? styles.unitOptionTextSelected : styles.unitOptionText}>
                            Imperial (mi)
                        </Text>
                    </Pressable>
                    <Pressable
                        style={[styles.unitOption, profile?.units === "metric" && styles.unitOptionSelected]}
                        onPress={() => updateProfile.mutate({ units: "metric" } as any)}
                    >
                        <Text style={profile?.units === "metric" ? styles.unitOptionTextSelected : styles.unitOptionText}>
                            Metric (km)
                        </Text>
                    </Pressable>
                </View>

                <View style={styles.settingRow}>
                    <Text style={styles.settingLabel}>Notifications</Text>
                    <Switch
                        value={profile?.notifications_enabled ?? true}
                        onValueChange={toggleNotifications}
                    />
                </View>
            </View>

            <Pressable style={styles.signOutButton} onPress={handleSignOut}>
                <Text style={styles.signOutText}>Sign Out</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "600",
        marginBottom: 24,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
    },
    email: {
        fontSize: 16,
        color: "#666",
        marginBottom: 12,
    },
    button: {
        backgroundColor: "#2323FF",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
    },
    settingRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    settingLabel: {
        fontSize: 16,
        marginBottom: 8,
    },
    unitRow: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 12,
    },
    unitOption: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#2323FF",
        borderRadius: 8,
        padding: 12,
        alignItems: "center",
    },
    unitOptionSelected: {
        backgroundColor: "#2323FF",
    },
    unitOptionText: {
        color: "#000",
        fontWeight: "600",
    },
    unitOptionTextSelected: {
        color: "#fff",
        fontWeight: "600",
    },
    signOutButton: {
        backgroundColor: "#ec1818",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: "auto",
    },
    signOutText: {
        color: "#fff",
        fontWeight: "600",
    },
});
