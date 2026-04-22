<<<<<<< HEAD
import { ActivityIndicator, Alert, ScrollView, Pressable, StyleSheet, Text, View } from "react-native";
import { useMarkAllNotificationsAsRead, useMarkNotificationAsRead, useNotifications, useDeleteNotification } from "@/hooks/useNotifications";
import { router } from "expo-router";
=======
>>>>>>> 5169992 (Merged UI redesign with existing app logic for tabs and screens)
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

  let unreadNotifications: NotificationRow[] = [];
  let earlierNotifications: NotificationRow[] = [];

  if (notifications) {
    unreadNotifications = notifications.filter((item) => item.is_read === false);
    earlierNotifications = notifications.filter((item) => item.is_read === true);
  }

  const handlePressNotification = async (notification: NotificationRow) => {
    if (!notification.is_read) {
      await markOneAsRead.mutateAsync(notification.id);
    }

    router.push(`/vehicle/${notification.vehicle_id}` as any);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead.mutateAsync();
  };

<<<<<<< HEAD
    const deleteNotificationMutation = useDeleteNotification(userId);

    let unreadNotifications: NotificationRow[] = [];
    let earlierNotifications: NotificationRow[] = [];
=======
  return (
    <View style={common.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.headerSubtitle}>
            Stay updated on maintenance schedules and appointments.
          </Text>
        </View>
>>>>>>> 5169992 (Merged UI redesign with existing app logic for tabs and screens)

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
              You&apos;re all caught up. Important updates about your vehicles
              and services will appear here.
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

<<<<<<< HEAD
            {error && (
                <Text style={styles.text}>Could not load notifications.</Text>
            )}

            {!isLoading && !error && notifications?.length === 0 && (
                <Text style={styles.text}>No unread notifications.</Text>
            )}

            {!isLoading && !error && unreadNotifications.length > 0 && (
                <>
                    <Text style={styles.listTitle}>Unread</Text>
                    {unreadNotifications.map((item) => (
                        <Pressable
                            key={item.id}
                            style={styles.card}
                            onPress={() => handlePressNotification(item)}
                        >
                        <View style={styles.row}>
                            <View style={styles.dot} />
                            <Text style={styles.typeText}>{item.type}</Text>
                        </View>

                            <Text style={styles.message}>{item.message}</Text>
                            <Text style={styles.dateText}>
                                Due: {item.scheduled_date}
                            </Text>
                        </Pressable>
                    ))}    
                </>
            )}
            {!isLoading && !error && earlierNotifications.length > 0 && (
                <>
                    <Text style={styles.listTitle}>Earlier</Text>
                    {earlierNotifications.map((item) => (
                        <View key={item.id} style={styles.card}>
                            <Pressable onPress={() => handlePressNotification(item)}>
                                <Text style={styles.typeText}>{item.type}</Text>
                                <Text style={styles.message}>{item.message}</Text>
                                <Text style={styles.dateText}>
                                    Due: {item.scheduled_date}
                                </Text>
                            </Pressable>
                            <Pressable
                                style={styles.deleteButton}
                                onPress={() => deleteNotificationMutation.mutate(item.id)}
                            >
                            <Text style={styles.deleteButtonText}>Delete</Text>
                            </Pressable>
                        </View>
                    ))}    
                </>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
    },
    text: {
        color: "#666",
        fontSize: 16,
        textAlign: "center",
        marginTop: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "600",
        marginBottom: 6,
    },
    sectionTitle: {
        fontSize: 14,
        color: "#666",
    },
    headerBox: {
        marginBottom: 20,
    },
    markAllButton: {
        backgroundColor: "#2563eb",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        alignSelf: "flex-start",
        marginTop: 10,
    },
    markAllButtonText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },
    listTitle: {
        fontSize: 20,
        fontWeight: "600",
        marginTop: 12,
        marginBottom: 10,
    },
    card: {
        backgroundColor: "#f5f5f5",
        borderRadius: 10,
        padding: 14,
        marginBottom: 12,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "red",
        marginRight: 8,
    },
    typeText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#444",
    },
    message: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 6,
    },
    dateText: {
        fontSize: 14,
        color: "#666",
    },
    deleteButton: {
        marginTop: 10,
        backgroundColor: "#d9534f",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        alignSelf: "flex-start",
    },

    deleteButtonText: {
        color: "white",
        fontWeight: "600",
    },
});

=======
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
    alignItems: "flex-start",
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
    maxWidth: 260,
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
    alignSelf: "flex-start",
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
});
>>>>>>> 5169992 (Merged UI redesign with existing app logic for tabs and screens)
