import React from "react";
<<<<<<< HEAD
import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import { useExportPdfAllVehicles, useExportSummaryPdfVehicle, useExportVehicleFullZip } from "@/hooks/useReports";
=======
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { common } from "../../styles/common";
import { colors, spacing } from "../../styles/themes";
import {
  useExportPdfAllVehicles,
  useExportSummaryPdfVehicle,
  useExportVehicleFullZip,
} from "@/hooks/useReports";
>>>>>>> 5169992 (Merged UI redesign with existing app logic for tabs and screens)
import { useAuth } from "@/contexts/AuthContext";
import { useVehicles } from "@/hooks/useVehicles";
import { Alert } from "react-native";

export default function ReportsScreen() {
  const { session } = useAuth();

<<<<<<< HEAD
    const exportPdfAll = useExportPdfAllVehicles();
    const exportPdfVehicle = useExportSummaryPdfVehicle();
=======
  let userId = "";
  if (session?.user) {
    userId = session.user.id;
  }

  const { data: vehicles, isLoading, error } = useVehicles();
>>>>>>> 5169992 (Merged UI redesign with existing app logic for tabs and screens)

  const exportPdfAll = useExportPdfAllVehicles();
  const exportPdfVehicle = useExportSummaryPdfVehicle();
  const exportZipVehicle = useExportVehicleFullZip();

  return (
    <View style={common.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reports</Text>
        <Text style={styles.headerSubtitle}>
          Export and review vehicle maintenance summaries.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>All Vehicle Reports</Text>
          <Text style={styles.sectionMeta}>Summary export</Text>
        </View>

<<<<<<< HEAD
                <View style={styles.vehicleRow}>
                    <Text style={styles.vehicleText}>All Vehicles</Text>
                    <View style={styles.buttonRow}>

                        <Pressable style={styles.formatButton} onPress={() => exportPdfAll.mutate(userId)}>
                            <Text style={styles.buttonText}>PDF</Text>
                        </Pressable>
                    </View>
                </View>

                {isLoading && <Text style={styles.message}>Loading vehicles...</Text>}
                {error && <Text style={styles.message}>Failed to load vehicles.</Text>}

                {!isLoading && !error && vehicles?.map((vehicle) => (
                    <View key={vehicle.id} style={styles.vehicleRow}>
                        <Text style={styles.vehicleText}>
                            {vehicle.year} {vehicle.make} {vehicle.model}
                        </Text>
                        <View style={styles.buttonRow}>

                            <Pressable style={styles.formatButton} onPress={() => exportPdfVehicle.mutate(vehicle.id, {
                                onError: (error: any) => {
                                    Alert.alert("PDF Error", error?.message || "PDF export failed");
                                },
                                onSuccess: () => {
                                    Alert.alert("Success", "PDF export finished");
                                },
                            })}>
                                <Text style={styles.buttonText}>PDF</Text>
                            </Pressable>
                        </View>
                    </View>
                ))}
=======
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

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.formatButton}
                onPress={() => exportPdfAll.mutate(userId)}
              >
                <Text style={styles.buttonText}>PDF</Text>
              </TouchableOpacity>
            </View>
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
                  Export a PDF summary or a full ZIP history for this vehicle.
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
>>>>>>> 5169992 (Merged UI redesign with existing app logic for tabs and screens)
            </View>
          ))}

<<<<<<< HEAD
            <View style={styles.box}>
                <Text style={styles.boxTitle}>Full Export</Text>

                {isLoading && <Text style={styles.message}>Loading vehicles...</Text>}
                {error && <Text style={styles.message}>Failed to load vehicles.</Text>}

                {!isLoading && !error && vehicles?.map((vehicle) => (
                    <View key={vehicle.id} style={styles.vehicleRow}>
                        <Text style={styles.vehicleText}>
                            {vehicle.year} {vehicle.make} {vehicle.model}
                        </Text>

                        <View style={styles.buttonRow}>
                            <Pressable style={styles.formatButton}onPress={() => exportZipVehicle.mutate(vehicle.id, {
                                onError: (error: any) => {
                                    Alert.alert("ZIP Error", error?.message || "ZIP export failed");
                                },
                                onSuccess: () => {
                                    Alert.alert("Success", "ZIP export finished");
                                },
                            })}>
                                <Text style={styles.buttonText}>ZIP</Text>
                            </Pressable>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
=======
        {!isLoading && !error && !vehicles?.length && (
          <View style={[common.card, styles.messageCard]}>
            <Ionicons
              name="document-outline"
              size={24}
              color={colors.muted}
            />
            <Text style={styles.message}>
              No vehicles found. Add a vehicle to generate reports.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
>>>>>>> 5169992 (Merged UI redesign with existing app logic for tabs and screens)
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
  sectionHeader: {
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
  },
  sectionMeta: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.muted,
  },
  reportCard: {
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  vehicleCard: {
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 4,
  },
  reportDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  formatButton: {
    backgroundColor: colors.text,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  zipButton: {
    backgroundColor: colors.purple,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  messageCard: {
    padding: 18,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});