import { useAuth } from "@/contexts/AuthContext";
import { useSignOut, useResetPassword } from "@/hooks/useAuth";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { common } from "../../styles/common";
import { colors, spacing } from "../../styles/themes";

export default function SettingsScreen() {
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
    updateProfile.mutate({
      notifications_enabled: !profile?.notifications_enabled,
    } as any);
  };

  const setUnits = (units: "imperial" | "metric") => {
    updateProfile.mutate({ units } as any);
  };

  return (
    <View style={common.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>
          Manage preferences, account options, and app behavior.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Account</Text>

        <View style={[common.card, styles.settingCard]}>
          <View style={styles.leftRow}>
            <View style={[styles.iconWrap, { backgroundColor: "#8cd7b2" }]}>
              <Ionicons name="person-outline" size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.settingText}>Email</Text>
              <Text style={styles.subText}>{userEmail || "No email found"}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[common.card, styles.settingCard]}
          onPress={handleChangePassword}
        >
          <View style={styles.leftRow}>
            <View style={[styles.iconWrap, { backgroundColor: "#F3F4F6" }]}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={colors.textSecondary}
              />
            </View>
            <Text style={styles.settingText}>
              {resetPasswordMutation.isPending
                ? "Sending reset link..."
                : "Change Password"}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.muted} />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={[common.card, styles.settingCard]}>
          <View style={styles.leftRow}>
            <View style={[styles.iconWrap, { backgroundColor: "#EFF6FF" }]}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color={colors.primary}
              />
            </View>
            <Text style={styles.settingText}>Notifications</Text>
          </View>
          <Switch
            value={profile?.notifications_enabled ?? true}
            onValueChange={toggleNotifications}
            trackColor={{ false: "#D1D5DB", true: "#93C5FD" }}
            thumbColor={
              profile?.notifications_enabled ?? true
                ? colors.primary
                : "#F3F4F6"
            }
          />
        </View>

        <View style={[common.card, styles.unitsCard]}>
          <Text style={styles.settingLabel}>Units</Text>

          <View style={styles.unitRow}>
            <TouchableOpacity
              style={[
                styles.unitOption,
                profile?.units === "imperial" && styles.unitOptionSelected,
              ]}
              onPress={() => setUnits("imperial")}
            >
              <Text
                style={
                  profile?.units === "imperial"
                    ? styles.unitOptionTextSelected
                    : styles.unitOptionText
                }
              >
                Imperial (mi)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.unitOption,
                profile?.units === "metric" && styles.unitOptionSelected,
              ]}
              onPress={() => setUnits("metric")}
            >
              <Text
                style={
                  profile?.units === "metric"
                    ? styles.unitOptionTextSelected
                    : styles.unitOptionText
                }
              >
                Metric (km)
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>About</Text>

        <View style={[common.card, styles.settingCard]}>
          <View style={styles.leftRow}>
            <View style={[styles.iconWrap, { backgroundColor: "#F3F4F6" }]}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={colors.textSecondary}
              />
            </View>
            <Text style={styles.settingText}>Version</Text>
          </View>
          <Text style={styles.versionText}>1.0.0</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={styles.logoutText}>
            {signOutMutation.isPending ? "Signing Out..." : "Sign Out"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
  },
  headerSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: colors.textSecondary,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 120,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.muted,
    textTransform: "uppercase",
    marginBottom: 12,
    marginTop: 8,
    letterSpacing: 0.8,
  },
  settingCard: {
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  unitsCard: {
    padding: 16,
    marginBottom: 10,
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  subText: {
    marginTop: 2,
    fontSize: 13,
    color: colors.textSecondary,
  },
  settingLabel: {
    fontSize: 16,
    marginBottom: 12,
    color: colors.text,
    fontWeight: "700",
  },
  unitRow: {
    flexDirection: "row",
    gap: 8,
  },
  unitOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  unitOptionSelected: {
    backgroundColor: colors.primary,
  },
  unitOptionText: {
    color: colors.text,
    fontWeight: "700",
  },
  unitOptionTextSelected: {
    color: "#fff",
    fontWeight: "700",
  },
  versionText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  logoutButton: {
    marginTop: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  logoutText: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: "800",
  },
});