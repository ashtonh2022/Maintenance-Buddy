import { useSignOut } from "@/hooks/useAuth";
import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

export default function Settings() {

    //sign out
    const signOutMutation = useSignOut();
    const handleSignOut = async () => {
        try {
            await signOutMutation.mutateAsync();
        } catch (error: any) {
            Alert.alert("Sign Out Failed", error.message || "Something went wrong");
        }
    };

    //sign out button
    return (
        <View style={styles.container}>
            <Pressable style={styles.signOutButton} onPress={handleSignOut}>
                <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#fff",
    },
    signOutButton: {
        backgroundColor: "#ec1818",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    signOutText: {
        color: "#fff",
        fontWeight: "600",
    },
});
