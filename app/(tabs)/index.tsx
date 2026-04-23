import { useVehicles } from "@/hooks/useVehicles";
import { useAllAppointments } from "@/hooks/useTimeline";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Dashboard() {
  const { data: vehicles, isLoading, error } = useVehicles();
  const {
    data: appointments,
    isLoading: appointmentsLoading,
    error: appointmentsError,
  } = useAllAppointments();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 700);
  };

  const tap = async () => {
    await Haptics.selectionAsync();
  };

  const vehicleCount = vehicles?.length ?? 0;
  const appointmentCount = appointments?.length ?? 0;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#b4a6ea", "#F8FAFC", "#bd9af1"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Maintenance Buddy</Text>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSubtitle}>
            Keep your garage organized and on schedule.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.headerIconButton}
          onPress={async () => {
            await tap();
            router.push("/notifications" as any);
          }}
        >
          <Ionicons name="notifications-outline" size={22} color="#1E293B" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <LinearGradient
          colors={["#2563EB", "#3B82F6", "#60A5FA"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <Text style={styles.heroLabel}>Garage Overview</Text>
          <Text style={styles.heroTitle}>{vehicleCount} Vehicles Active</Text>
          <Text style={styles.heroSubtext}>
            {appointmentCount} upcoming appointments scheduled
          </Text>

          <View style={styles.heroStatsRow}>
            <View style={styles.heroStatChip}>
              <Ionicons name="car-outline" size={16} color="#DBEAFE" />
              <Text style={styles.heroStatText}>Vehicles {vehicleCount}</Text>
            </View>
            <View style={styles.heroStatChip}>
              <Ionicons name="calendar-outline" size={16} color="#DBEAFE" />
              <Text style={styles.heroStatText}>
                Appointments {appointmentCount}
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>

          <View style={styles.quickGrid}>
            <TouchableOpacity
              style={styles.quickCard}
              onPress={async () => {
                await tap();
                router.push("/vehicle/add" as any);
              }}
            >
              <View style={[styles.quickIconWrap, { backgroundColor: "#DBEAFE" }]}>
                <Ionicons name="car-outline" size={20} color="#2563EB" />
              </View>
              <Text style={styles.quickTitle}>Add Vehicle</Text>
              <Text style={styles.quickSubtext}>Create a new garage entry</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
            <Text style={styles.sectionMeta}>{appointmentCount} scheduled</Text>
          </View>

          {appointmentsLoading && (
            <Text style={styles.emptyText}>Loading appointments...</Text>
          )}

          {appointmentsError && (
            <Text style={styles.emptyText}>Failed to load appointments.</Text>
          )}

          {!appointmentsLoading &&
            !appointmentsError &&
            appointmentCount === 0 && (
              <Text style={styles.emptyText}>No upcoming appointments.</Text>
            )}

          {!appointmentsLoading &&
            !appointmentsError &&
            appointments?.map((appointment) => (
              <View key={appointment.id} style={styles.appointmentCard}>
                <View style={styles.appointmentDate}>
                  <Text style={styles.appointmentDay}>
                    {new Date(appointment.date).getDate()}
                  </Text>
                  <Text style={styles.appointmentMonth}>
                    {new Date(appointment.date).toLocaleDateString("en-US", {
                      month: "short",
                    })}
                  </Text>
                </View>

                <View style={styles.appointmentInfo}>
                  <Text style={styles.appointmentTitle}>
                    {appointment.service_type}
                  </Text>
                  <Text style={styles.appointmentVehicle}>
                    {appointment.time ?? "No time set"}
                  </Text>
                  {appointment.mechanic_shop ? (
                    <Text style={styles.appointmentShop}>
                      {appointment.mechanic_shop}
                    </Text>
                  ) : null}
                  {appointment.description ? (
                    <Text style={styles.appointmentShop}>
                      {appointment.description}
                    </Text>
                  ) : null}
                </View>
              </View>
            ))}
        </View>

        <View style={[styles.section, styles.bottomSpacing]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Vehicles</Text>
            <Text style={styles.sectionMeta}>{vehicleCount} total</Text>
          </View>

          {isLoading && <Text style={styles.emptyText}>Loading vehicles...</Text>}
          {error && <Text style={styles.emptyText}>Failed to load vehicles.</Text>}
          {!isLoading && !error && vehicleCount === 0 && (
            <Text style={styles.emptyText}>No vehicles yet.</Text>
          )}

          {!isLoading &&
            !error &&
            vehicles?.map((vehicle) => (
              <TouchableOpacity
                key={vehicle.id}
                style={styles.vehicleCard}
                onPress={async () => {
                  await tap();
                  router.push(`/vehicle/${vehicle.id}` as any);
                }}
              >
                <View style={styles.vehicleIcon}>
                  <Ionicons name="car-sport-outline" size={26} color="#2563EB" />
                </View>

                <View style={styles.vehicleInfo}>
                  <Text style={styles.vehicleName}>
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </Text>
                  <Text style={styles.vehicleMileage}>
                    {vehicle.recent_mileage?.toLocaleString()} miles
                  </Text>
                  <Text style={styles.vehicleServices}>
                    Ready for service tracking
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },

  header: {
    paddingHorizontal: 20,
    paddingTop: 62,
    paddingBottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2563EB",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: "#0F172A",
  },
  headerSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#64748B",
  },
  headerIconButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.8)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },

  scrollView: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 120 },

  heroCard: {
    borderRadius: 26,
    padding: 22,
    marginBottom: 22,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 8,
  },
  heroLabel: {
    color: "#DBEAFE",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  heroTitle: {
    marginTop: 8,
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
  },
  heroSubtext: {
    marginTop: 6,
    color: "#E0E7FF",
    fontSize: 14,
    lineHeight: 20,
  },
  heroStatsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
    flexWrap: "wrap",
  },
  heroStatChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  heroStatText: {
    color: "#F8FAFC",
    fontSize: 12,
    fontWeight: "700",
  },

  section: {
    marginBottom: 22,
  },
  sectionHeader: {
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
  },
  sectionMeta: {
    fontSize: 13,
    fontWeight: "600",
    color: "#94A3B8",
  },

  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickCard: {
    width: "48%",
    backgroundColor: "rgba(255,255,255,0.88)",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 3,
  },
  quickIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  quickTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },
  quickSubtext: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: "#64748B",
  },

  vehicleCard: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  vehicleIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  vehicleInfo: { flex: 1 },
  vehicleName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 4,
  },
  vehicleMileage: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 2,
  },
  vehicleServices: {
    fontSize: 12,
    color: "#94A3B8",
  },

  appointmentCard: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  appointmentDate: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  appointmentDay: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2563EB",
  },
  appointmentMonth: {
    fontSize: 11,
    color: "#2563EB",
    textTransform: "uppercase",
    fontWeight: "700",
  },
  appointmentInfo: { flex: 1 },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 4,
  },
  appointmentVehicle: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 2,
  },
  appointmentShop: {
    fontSize: 12,
    color: "#94A3B8",
  },

  emptyText: {
    color: "#666",
    fontSize: 16,
    marginTop: 6,
    marginBottom: 8,
  },

  bottomSpacing: {
    marginBottom: 18,
  },
});