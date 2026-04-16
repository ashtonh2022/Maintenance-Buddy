import { useAddServiceEvent } from "@/hooks/useTimeline";
import { useLocalSearchParams, router } from "expo-router";
import React, { useState } from "react";
import { Button, Text, TextInput, View, Pressable, StyleSheet } from "react-native";
import { useAddAttachment } from "@/hooks/useAttachment";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

export default function AddService() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const addServiceEvent = useAddServiceEvent();
    const addAttachment = useAddAttachment();

    const [date, setDate] = useState("");
    const [mileage_at_service, setMileage] = useState("");
    const [serviceType, setServiceType] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [photoFile, setPhotoFile] = useState<any>(null);
    const [documentFile, setDocumentFile] = useState<any>(null);

    const toggleTag = (tag: string) => {
        let newTags: string[] = [];
        let found = false;
        for (let i = 0; i < tags.length; i++) {
            if (tags[i] === tag) {
                found = true;
            }
        }

        if (found) {
            for (let i = 0; i < tags.length; i++) {
                if (tags[i] !== tag) {
                    newTags.push(tags[i]);
            }
        }
        } else {
            for (let i = 0; i < tags.length; i++) {
                newTags.push(tags[i]);
            }
            newTags.push(tag);
        }
        setTags(newTags);
    };

    const pickPhoto = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: false,
            quality: 1,
        });
        if (!result.canceled) {
            setPhotoFile(result.assets[0]);
        }
    };

    const pickDocument = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: ["application/pdf", "text/plain"],
            multiple: false,
            copyToCacheDirectory: true,
        });
        if (!result.canceled) {
            setDocumentFile(result.assets[0]);
        }
    };

    const handleSubmit = async () => {
        const newEntry = await addServiceEvent.mutateAsync({
            vehicle_id: id,
            date,
            mileage_at_service: mileage_at_service ? Number(mileage_at_service) : null,
            service_type: serviceType,
            description,
            tags,
            is_completed: true,
        });

        if (photoFile) {
            await addAttachment.mutateAsync({
                timeline_entry_id: newEntry.id,
                file_path: photoFile.uri,
                file_size: photoFile.fileSize ?? 0,
                file_type: photoFile.mimeType ?? "image/jpeg",
            });
        }

        if (documentFile) {
            await addAttachment.mutateAsync({
                timeline_entry_id: newEntry.id,
                file_path: documentFile.uri,
                file_size: documentFile.size ?? 0,
                file_type: documentFile.mimeType ?? "application/pdf",
            });
        }
        router.back();
    };

    return (
        <View style={{ padding: 20 }}>
            <TextInput placeholder="Date" value={date} onChangeText={setDate} />
            <TextInput placeholder="Mileage" value={mileage_at_service} onChangeText={setMileage} />
            <TextInput placeholder="Service Type" value={serviceType} onChangeText={setServiceType} />
            <TextInput placeholder="Description" value={description} onChangeText={setDescription} />

            <Text style={styles.label}>Tags</Text>
            <View style={styles.tagRow}>
            <Pressable
                style={[styles.tagButton, tags.includes("DIY") && styles.tagButtonActive]}
                onPress={() => toggleTag("DIY")}
            >
                <Text style={[styles.tagButtonText, tags.includes("DIY") && styles.tagButtonTextActive]}>DIY</Text>
            </Pressable>

        <Pressable
            style={[styles.tagButton, tags.includes("Cosmetic") && styles.tagButtonActive]}
            onPress={() => toggleTag("Cosmetic")}
        >
            <Text style={[styles.tagButtonText, tags.includes("Cosmetic") && styles.tagButtonTextActive]}>Cosmetic</Text>
        </Pressable>

        <Pressable
            style={[styles.tagButton, tags.includes("Performance") && styles.tagButtonActive]}
            onPress={() => toggleTag("Performance")}
        >
            <Text style={[styles.tagButtonText, tags.includes("Performance") && styles.tagButtonTextActive]}>Performance</Text>
        </Pressable>
        </View>

        <Text style={styles.label}>Photo</Text>
        <Pressable style={styles.pickButton} onPress={pickPhoto}>
            <Text style={styles.pickButtonText}>
                {photoFile ? "Photo Selected" : "Choose Photo"}
            </Text>
        </Pressable>

        <Text style={styles.label}>Document</Text>
        <Pressable style={styles.pickButton} onPress={pickDocument}>
            <Text style={styles.pickButtonText}>
                {documentFile ? "Document Selected" : "Choose Document"}
            </Text>
        </Pressable>

        <Button title="Save Service Event" onPress={handleSubmit} />
        </View>
    );
    
}
const styles = StyleSheet.create({
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginTop: 12,
        marginBottom: 8,
    },
    tagRow: {
        flexDirection: "row",
        marginBottom: 16,
        flexWrap: "wrap",
    },
    tagButton: {
        borderWidth: 1,
        borderColor: "#2323FF",
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginRight: 8,
        marginBottom: 8,
    },
    tagButtonActive: {
        backgroundColor: "#2323FF",
    },
    tagButtonText: {
        color: "#2323FF",
        fontWeight: "600",
    },
    tagButtonTextActive: {
        color: "#fff",
    },
    pickButton: {
        backgroundColor: "#2323FF",
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 8,
        marginBottom: 12,
        alignSelf: "flex-start",
    },
    pickButtonText: {
        color: "#fff",
        fontWeight: "600",
    },
});