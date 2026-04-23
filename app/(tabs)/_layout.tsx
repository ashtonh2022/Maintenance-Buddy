import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { Tabs } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Platform, StyleSheet, View } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { useUnreadNotificationCount } from "@/hooks/useNotifications";

function TabBarIcon({
  focused,
  color,
  size,
  activeName,
  inactiveName,
}: {
  focused: boolean;
  color: string;
  size: number;
  activeName: keyof typeof Ionicons.glyphMap;
  inactiveName: keyof typeof Ionicons.glyphMap;
}) {
  const scale = useRef(new Animated.Value(focused ? 1.12 : 1)).current;
  const wasFocused = useRef(focused);

  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1.15 : 1,
      useNativeDriver: true,
      friction: 5,
      tension: 120,
    }).start();

    if (focused && !wasFocused.current) {
      Haptics.selectionAsync();
    }

    wasFocused.current = focused;
  }, [focused, scale]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Ionicons
        name={focused ? activeName : inactiveName}
        size={size}
        color={color}
      />
    </Animated.View>
  );
}

export default function TabsLayout() {
  const { session } = useAuth();

  let userId = "";
  if (session?.user) {
    userId = session.user.id;
  }

  const { data: unreadCount } = useUnreadNotificationCount(userId);
  const badgeCount = Number(unreadCount ?? 0);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1f0da7",
        tabBarInactiveTintColor: "#000000",
        tabBarLabelStyle: styles.label,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => (
          <View style={StyleSheet.absoluteFill}>
            <BlurView intensity={70} tint="light" style={StyleSheet.absoluteFill} />
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon
              focused={focused}
              color={color}
              size={size}
              activeName="home"
              inactiveName="home-outline"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarBadge: badgeCount > 0 ? badgeCount : undefined,
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon
              focused={focused}
              color={color}
              size={size}
              activeName="notifications"
              inactiveName="notifications-outline"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="reports"
        options={{
          title: "Reports",
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon
              focused={focused}
              color={color}
              size={size}
              activeName="folder"
              inactiveName="folder-outline"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon
              focused={focused}
              color={color}
              size={size}
              activeName="settings"
              inactiveName="settings-outline"
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 18,
    height: 82,
    borderTopWidth: 0,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.85)",
    overflow: "hidden",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: Platform.OS === "android" ? 14 : 0,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 4,
  },
});