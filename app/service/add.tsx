import { useAddServiceEvent, useUpdateTimelineEntry } from "@/hooks/useTimeline";
import { getTimelineEntryById } from "@/services/timeline";
import { deleteNotificationByVehicleAndDate } from "@/services/notifications";
import { useLocalSearchParams, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Button, Platform, Text, TextInput, View, Pressable, StyleSheet } from "react-native";
import { useAddAttachment } from "@/hooks/useAttachment";
import { formatDate, parsePositiveInt } from "@/lib/validation";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { supabase } from "@/lib/supabase";

export default function AddService() {
    const { id, appointmentId } = useLocalSearchParams<{ id: string; appointmentId?: string }>();
    const addServiceEvent = useAddServiceEvent();
    const updateEntry = useUpdateTimelineEntry(id!);
    const addAttachment = useAddAttachment();
    const isCompleting = !!appointmentId;

    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [mileageAtService, setMileage] = useState("");
    const [serviceType, setServiceType] = useState("");
    const [mechanicShop, setMechanicShop] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState<string[]>([]);

    // Pre-fill from appointment if completing one
    useEffect(() => {
        if (!appointmentId) return;
        getTimelineEntryById(appointmentId).then((entry) => {
            setServiceType(entry.service_type);
            setDate(new Date(entry.date));
            if (entry.mechanic_shop) setMechanicShop(entry.mechanic_shop);
            if (entry.description) setDescription(entry.description);
        });
    }, [appointmentId]);
    const [photoFile, setPhotoFile] = useState<any>(null);
    const [documentFile, setDocumentFile] = useState<any>(null);
    const [time, setTime] = useState("");

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

    async function uploadFileToStorage(uri: string, folder: string, defaultName: string, contentType: string) {
        const fileName = uri.split("/").pop() ?? defaultName;
        const filePath = folder + "/" + Date.now() + "-" + fileName;

        const response = await fetch(uri);
        const arrayBuffer = await response.arrayBuffer();

        const { error } = await supabase.storage
            .from("attachments")
            .upload(filePath, arrayBuffer, {
                contentType: contentType,
            });
        if (error) {
            throw error;
        }
        return filePath;
    }

    const handleSubmit = async () => {
        if (!serviceType) {
            Alert.alert("Error", "Please enter a service type");
            return;
        }

        if (mileageAtService && parsePositiveInt(mileageAtService) === null) {
            Alert.alert("Error", "Mileage must be a positive number");
            return;
        }

        let entryId: string;

        if (isCompleting) {
            // Update existing appointment to mark as completed service event
            const updated = await updateEntry.mutateAsync({
                id: appointmentId!,
                timelineEntry: {
                    date: formatDate(date),
                    mileage_at_service: mileageAtService ? parsePositiveInt(mileageAtService) : null,
                    service_type: serviceType,
                    mechanic_shop: mechanicShop || null,
                    description,
                    tags,
                    is_completed: true,
                },
            });
            entryId = updated.id;
            await deleteNotificationByVehicleAndDate(id!, formatDate(date));
        } else {
            // Create new service event
            const newEntry = await addServiceEvent.mutateAsync({
                vehicle_id: id,
                date: formatDate(date),
                mileage_at_service: mileageAtService ? parsePositiveInt(mileageAtService) : null,
                service_type: serviceType,
                mechanic_shop: mechanicShop || null,
                description,
                tags,
                is_completed: true,
            });
            entryId = newEntry.id;
        }

        if (photoFile) {
            let photoType = photoFile.mimeType ?? "image/jpeg";

            if (photoType.startsWith("text/plain")) {
                photoType = "image/jpeg";
            }

            const uploadedPhotoPath = await uploadFileToStorage(
                photoFile.uri,
                "service-photos",
                "photo.jpg",
                photoType
            );

            await addAttachment.mutateAsync({
                timeline_entry_id: newEntry.id,
                file_path: uploadedPhotoPath,
                file_size: photoFile.fileSize ?? 0,
                file_type: photoFile.mimeType ?? "image/jpeg",
            });
        }

        if (documentFile) {
            let docType = documentFile.mimeType ?? "application/pdf";

            if (docType.startsWith("text/plain")) {
                docType = "text/plain";
            }

            const uploadedDocPath = await uploadFileToStorage(
                documentFile.uri,
                "service-docs",
                "document.pdf",
                docType
            );

            await addAttachment.mutateAsync({
                timeline_entry_id: newEntry.id,
                file_path: uploadedDocPath,
                file_size: documentFile.size ?? 0,
                file_type: documentFile.mimeType ?? "application/pdf",
            });
        };
        router.back();
    }

    return (
        <View style={{ padding: 20 }}>
            <Text style={styles.label}>Date</Text>
            <Pressable style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                <Text>{formatDate(date)}</Text>
            </Pressable>
            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    onChange={(_, selected) => {
                        setShowDatePicker(Platform.OS === "ios");
                        if (selected) setDate(selected);
                    }}
                />
            )}
            <TextInput style={styles.input} placeholder="Mileage (optional)" value={mileageAtService} onChangeText={setMileage} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Service Type" value={serviceType} onChangeText={setServiceType} />
            <TextInput style={styles.input} placeholder="Mechanic Shop (optional)" value={mechanicShop} onChangeText={setMechanicShop} />
            <TextInput style={styles.input} placeholder="Description (optional)" value={description} onChangeText={setDescription} />

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

        <Button title={isCompleting ? "Complete Appointment" : "Save Service Event"} onPress={handleSubmit} />
        </View>
    );
    
}
const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: "#2323FF",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    dateButton: {
        borderWidth: 1,
        borderColor: "#2323FF",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
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