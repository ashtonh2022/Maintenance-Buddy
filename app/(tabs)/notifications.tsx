import { ActivityIndicator, Alert, ScrollView, Pressable, StyleSheet, Text, View } from "react-native";
import { useMarkAllNotificationsAsRead, useMarkNotificationAsRead, useNotifications } from "@/hooks/useNotifications";
import { router } from "expo-router";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationRow } from "@/types/types";

export default function Notifications() {
    const { session } = useAuth();
    let userId = "";
    if (session && session.user) {
        userId = session.user.id;
    }

    const {data: notifications, error, isLoading} = useNotifications(userId)

    const markOneAsRead = useMarkNotificationAsRead(userId);
    const markAllAsRead = useMarkAllNotificationsAsRead(userId);

    let unreadNotifications: NotificationRow[] = [];
    let earlierNotifications: NotificationRow[] = [];

    if (notifications) {
        unreadNotifications = notifications.filter((item) => item.is_read === false);
        earlierNotifications = notifications.filter((item) => item.is_read === true);
    }

    const handlePressNotification = async (notification: any) => {
        if (notification.is_read === false) {
                await markOneAsRead.mutateAsync(notification.id);
            }
        router.push(`/vehicle/${notification.vehicle_id}`);
    }

    const handleMarkAllAsRead = async () => {
        await markAllAsRead.mutateAsync();
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerBox}>
                <View>
                    <Text style={styles.title}>Notifications</Text>
                    <Text style={styles.sectionTitle}>
                        Stay updated on maintenance schedules and appointments
                    </Text>
                </View>

                {notifications && notifications.length > 0 && (
                    <Pressable
                        style={styles.markAllButton}
                        onPress={handleMarkAllAsRead}
                    >
                        <Text style={styles.markAllButtonText}>Mark All as Read</Text>
                    </Pressable>
                )}
            </View>

            {isLoading && <ActivityIndicator size="large" />}

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
});

