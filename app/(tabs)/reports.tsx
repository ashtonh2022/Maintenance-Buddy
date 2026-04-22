import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { common } from "../../styles/common";
import { colors, spacing } from "../../styles/themes";

import {
  useExportPdfAllVehicles,
  useExportSummaryPdfVehicle,
  useExportVehicleFullZip,
} from "@/hooks/useReports";
import { useAuth } from "@/contexts/AuthContext";
import { useVehicles } from "@/hooks/useVehicles";

export default function ReportsScreen() {
  const { session } = useAuth();
  const userId = session?.user?.id ?? "";

  const { data: vehicles, isLoading, error } = useVehicles();

  const exportPdfAll = useExportPdfAllVehicles();
  const exportPdfVehicle = useExportSummaryPdfVehicle();
  const exportZipVehicle = useExportVehicleFullZip();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={common.screen}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Reports</Text>
            <Text style={styles.headerSubtitle}>
              Export and review vehicle maintenance summaries.
            </Text>
          </View>

          <View style={[common.card, styles.reportCard]}>
            <View
              style={[styles.iconWrap, { backgroundColor: colors.primaryLight }]}
            >
              <Ionicons
                name="document-text-outline"
                size={22}
                color={colors.primary}
              />
            </View>

            <View style={styles.reportInfo}>
              <Text style={styles.reportTitle}>Maintenance Summary</Text>
              <Text style={styles.reportDescription}>
                Export one PDF summary for all vehicles.
              </Text>

              <TouchableOpacity
                style={styles.formatButton}
                onPress={() => exportPdfAll.mutate(userId)}
              >
                <Text style={styles.buttonText}>PDF</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Vehicle Reports</Text>
            <Text style={styles.sectionMeta}>
              {vehicles?.length ?? 0} vehicles
            </Text>
          </View>

          {isLoading && (
            <View style={[common.card, styles.messageCard]}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.message}>Loading vehicles...</Text>
            </View>
          )}

          {error && (
            <View style={[common.card, styles.messageCard]}>
              <Ionicons
                name="alert-circle-outline"
                size={22}
                color={colors.danger}
              />
              <Text style={styles.message}>Failed to load vehicles.</Text>
            </View>
          )}

          {!isLoading &&
            !error &&
            vehicles?.map((vehicle) => (
              <View key={vehicle.id} style={[common.card, styles.vehicleCard]}>
                <View
                  style={[styles.iconWrap, { backgroundColor: "#EDE9FE" }]}
                >
                  <Ionicons
                    name="car-sport-outline"
                    size={22}
                    color={colors.purple}
                  />
                </View>

                <View style={styles.reportInfo}>
                  <Text style={styles.reportTitle}>
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </Text>

                  <Text style={styles.reportDescription}>
                    Export a PDF summary or full export file.
                  </Text>

                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.formatButton}
                      onPress={() => exportPdfVehicle.mutate(vehicle.id)}
                    >
                      <Text style={styles.buttonText}>PDF</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.formatButton, styles.zipButton]}
                      onPress={() => exportZipVehicle.mutate(vehicle.id)}
                    >
                      <Text style={styles.buttonText}>ZIP</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

          {!isLoading && !error && !vehicles?.length && (
            <View style={[common.card, styles.messageCard]}>
              <Ionicons
                name="document-outline"
                size={24}
                color={colors.muted}
              />
              <Text style={styles.message}>
                No vehicles found. Add one first.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 140,
  },
  header: {
    marginBottom: spacing.lg,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 6,
    lineHeight: 22,
  },
  reportCard: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "flex-start",
    marginBottom: spacing.xl,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
  },
  reportDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 6,
    marginBottom: 12,
    lineHeight: 20,
  },
  formatButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  zipButton: {
    backgroundColor: colors.purple,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  sectionMeta: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  vehicleCard: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  buttonRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  messageCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: 20,
  },
  message: {
    fontSize: 15,
    color: colors.textSecondary,
    flexShrink: 1,
  },
});