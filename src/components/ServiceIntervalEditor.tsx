import React from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

type ServiceIntervalEditorProps = {
    serviceName: string;
    intervalMiles: number;
    enabled?: boolean;
    showEnabledToggle?: boolean;
    onIntervalChange: (newInterval: number) => void;
    onEnabledChange?: (enabled: boolean) => void;
    onRemove?: () => void;
    children?: React.ReactNode;
};

export default function ServiceIntervalEditor({
    serviceName,
    intervalMiles,
    enabled = true,
    showEnabledToggle = false,
    onIntervalChange,
    onEnabledChange,
    onRemove,
    children,
}: ServiceIntervalEditorProps) {

    const adjust = (amount: number) => {
        const newVal = intervalMiles + amount;
        if (newVal >= 1000) {
            onIntervalChange(newVal);
        }
    };

    return (
        <View style={[styles.container, !enabled && styles.containerDisabled]}>
            <View style={styles.header}>
                <Text style={[styles.serviceName, !enabled && styles.textDisabled]}>
                    {serviceName}
                </Text>
                {showEnabledToggle && onEnabledChange && (
                    <Switch
                        value={enabled}
                        onValueChange={onEnabledChange}
                    />
                )}
                {onRemove && !showEnabledToggle && (
                    <Pressable onPress={onRemove}>
                        <Text style={styles.removeText}>Remove</Text>
                    </Pressable>
                )}
            </View>

            {enabled && (
                <View style={styles.intervalRow}>
                    <Pressable style={styles.arrowButton} onPress={() => adjust(-5000)}>
                        <Text style={styles.arrowText}>{"<<"}</Text>
                    </Pressable>
                    <Pressable style={styles.arrowButton} onPress={() => adjust(-1000)}>
                        <Text style={styles.arrowText}>{"<"}</Text>
                    </Pressable>
                    <Text style={styles.intervalText}>
                        {intervalMiles.toLocaleString()} mi
                    </Text>
                    <Pressable style={styles.arrowButton} onPress={() => adjust(1000)}>
                        <Text style={styles.arrowText}>{">"}</Text>
                    </Pressable>
                    <Pressable style={styles.arrowButton} onPress={() => adjust(5000)}>
                        <Text style={styles.arrowText}>{">>"}</Text>
                    </Pressable>
                </View>
            )}

            {enabled && children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.3)",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    containerDisabled: {
        opacity: 0.5,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    serviceName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#FFFFFF",
    },
    textDisabled: {
        color: "#999",
    },
    removeText: {
        color: "red",
        fontSize: 14,
    },
    intervalRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    arrowButton: {
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.5)",
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    arrowText: {
        color: "#FFFFFF",
        fontWeight: "600",
        fontSize: 16,
    },
    intervalText: {
        fontSize: 16,
        fontWeight: "600",
        minWidth: 100,
        textAlign: "center",
        color: "#FFFFFF",
    },
});
