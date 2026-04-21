import { useTimelineEntry } from "@/hooks/useTimeline";
import { supabase } from "@/lib/supabase";
import { useLocalSearchParams } from "expo-router";
import * as Linking from "expo-linking";
import React, { useState, useEffect } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

function isImage(fileType?: string | null) {
    if (!fileType) {
        return false;
    }

    return fileType.startsWith("image/");
}

export default function ServiceDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data: entry, isLoading, error } = useTimelineEntry(String(id));
    const [attachmentUrls, setAttachmentUrls] = useState<Record<string, string>>({});
    const attachments = entry?.attachments ?? [];

    useEffect(() => {
        async function loadSignedUrls() {
            const urlMap: Record<string, string> = {};

            for (let i = 0; i < attachments.length; i++) {
                const attachment = attachments[i];

                const { data, error } = await supabase.storage
                    .from("attachments")
                    .createSignedUrl(attachment.file_path, 3600);

                if (!error && data?.signedUrl) {
                    urlMap[attachment.id] = data.signedUrl;
                }
            }   

            setAttachmentUrls(urlMap);
        }

        if (attachments.length > 0) {
            loadSignedUrls();
        }
    }, [attachments]);

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (error || !entry) {
        return (
            <View style={styles.center}>
                <Text>Failed to load service event.</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{entry.service_type}</Text>

            <View style={styles.card}>
                <Text style={styles.label}>Date</Text>
                <Text style={styles.value}>{entry.date}</Text>

                <Text style={styles.label}>Time</Text>
                <Text style={styles.value}>{entry.time ?? "N/A"}</Text>

                <Text style={styles.label}>Mileage</Text>
                <Text style={styles.value}>{entry.mileage_at_service ?? "N/A"}</Text>

                <Text style={styles.label}>Completed</Text>
                <Text style={styles.value}>{entry.is_completed ? "Yes" : "No"}</Text>

                <Text style={styles.label}>Description</Text>
                <Text style={styles.value}>{entry.description ?? "N/A"}</Text>
            </View>

            <Text style={styles.heading}>Attachments</Text>

            {attachments.length === 0 && (
                <Text style={styles.emptyText}>No attachments uploaded.</Text>
            )}

            {attachments.map((attachment) => {
                const fileUrl = attachmentUrls[attachment.id];
                const fileName = attachment.file_path.split("/").pop() ?? "Attachment";

                if (!fileUrl) {
                    return null;
                }

                if (isImage(attachment.file_type)) {
                    return (
                        <Pressable
                            key={attachment.id}
                            style={styles.attachmentCard}
                            onPress={() => Linking.openURL(fileUrl)}
                        >
                            <Image
                                source={{ uri: fileUrl }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                            <Text style={styles.fileName}>{fileName}</Text>
                        </Pressable>
                    );
                }

                return (
                    <Pressable
                        key={attachment.id}
                        style={styles.fileCard}
                        onPress={() => Linking.openURL(fileUrl)}
                    >
                        <Text style={styles.fileName}>{fileName}</Text>
                        <Text style={styles.fileType}>
                            {attachment.file_type ?? "File"}
                        </Text>
                    </Pressable>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#fff",
        flexGrow: 1,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "600",
        marginBottom: 20,
    },
    card: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 16,
        backgroundColor: "#f9f9f9",
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        marginTop: 10,
        color: "#444",
    },
    value: {
        fontSize: 16,
        marginTop: 4,
        color: "#000",
    },
    heading: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 12,
    },
    emptyText: {
        color: "#666",
    },
    attachmentCard: {
        marginBottom: 16,
    },
    image: {
        width: "100%",
        height: 220,
        borderRadius: 10,
        marginBottom: 8,
    },
    fileCard: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 12,
        backgroundColor: "#f9f9f9",
        marginBottom: 12,
    },
    fileName: {
        fontSize: 14,
        fontWeight: "600",
    },
    fileType: {
        fontSize: 12,
        color: "#666",
        marginTop: 4,
    },
});