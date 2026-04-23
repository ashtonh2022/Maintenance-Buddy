import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { useAuth } from "@/contexts/AuthContext";
import {
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useNotifications,
} from "@/hooks/useNotifications";
import { NotificationRow } from "@/types/types";

import { common } from "../../styles/common";
import { colors, spacing } from "../../styles/themes";

export default function NotificationsScreen() {
  const { session } = useAuth();

  let userId = "";
  if (session?.user) {
    userId = session.user.id;
  }

  const { data: notifications, error, isLoading } = useNotifications(userId);

  const markOneAsRead = useMarkNotificationAsRead(userId);
  const markAllAsRead = useMarkAllNotificationsAsRead(userId);

  const unreadNotifications: NotificationRow[] =
    notifications?.filter((item) => item.is_read === false) ?? [];

  const earlierNotifications: NotificationRow[] =
    notifications?.filter((item) => item.is_read === true) ?? [];

  const handlePressNotification = async (notification: NotificationRow) => {
    if (!notification.is_read) {
      await markOneAsRead.mutateAsync(notification.id);
    }

    router.push(`/vehicle/${notification.vehicle_id}` as any);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead.mutateAsync();
  };

  return (
    <View style={common.screen}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.headerSubtitle}>
            Stay updated on maintenance schedules and appointments.
          </Text>
        </View>

        {!!notifications?.length && (
          <Pressable style={styles.markAllButton} onPress={handleMarkAllAsRead}>
            <Text style={styles.markAllButtonText}>Mark All Read</Text>
          </Pressable>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {isLoading && (
          <View style={[common.card, styles.centerCard]}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.helperText}>Loading notifications...</Text>
          </View>
        )}

        {!isLoading && error && (
          <View style={[common.card, styles.centerCard]}>
            <Ionicons
              name="alert-circle-outline"
              size={36}
              color={colors.danger}
            />
            <Text style={styles.emptyTitle}>Could not load notifications</Text>
            <Text style={styles.emptySubtitle}>Try again in a moment.</Text>
          </View>
        )}

        {!isLoading && !error && notifications?.length === 0 && (
          <View style={[common.card, styles.centerCard]}>
            <Ionicons
              name="notifications-outline"
              size={40}
              color={colors.muted}
            />
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptySubtitle}>
              You're all caught up. Important updates about your vehicles and
              services will appear here.
            </Text>
          </View>
        )}

        {!isLoading && !error && unreadNotifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Unread</Text>

            {unreadNotifications.map((item) => (
              <Pressable
                key={item.id}
                style={[common.card, styles.notificationCard]}
                onPress={() => handlePressNotification(item)}
              >
                <View style={styles.row}>
                  <View style={styles.unreadDot} />
                  <Text style={styles.typeText}>{item.type}</Text>
                </View>

                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.dateText}>Due: {item.scheduled_date}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {!isLoading && !error && earlierNotifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Earlier</Text>

            {earlierNotifications.map((item) => (
              <Pressable
                key={item.id}
                style={[common.card, styles.notificationCard]}
                onPress={() => handlePressNotification(item)}
              >
                <Text style={styles.typeText}>{item.type}</Text>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.dateText}>Due: {item.scheduled_date}</Text>
              </Pressable>
            ))}
          </View>
        )}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
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
    maxWidth: 220,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 120,
  },
  markAllButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: "center",
    flexShrink: 0,
  },
  markAllButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  centerCard: {
    alignItems: "center",
    padding: 28,
  },
  helperText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyTitle: {
    marginTop: 14,
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
  },
  emptySubtitle: {
    marginTop: 8,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 12,
  },
  notificationCard: {
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.danger,
    marginRight: 8,
  },
  typeText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textSecondary,
    textTransform: "capitalize",
  },
  message: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 6,
  },
  dateText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  headerText: {
  flex: 1,
  paddingRight: 10,
  },
});