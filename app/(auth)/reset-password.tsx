import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../constants/colors";

export default function ResetPassword() {
    const [email, setEmail] = useState<string>("");

  //if email field is left blank
    const handleResetPassword = async () => {
        if (!email) {
            Alert.alert("Error", "Please enter your email");
            return;
        }

        try {
            //sends password reset from supabase
            const { error } = await supabase.auth.resetPasswordForEmail(email);

            //if supabase returns error
            if (error) {
                throw error;
            }
            Alert.alert("Success", "Password reset email sent", [{
                text: "OK",
                onPress: () => router.push("/(auth)/login"),
            },]);
        } catch (error: any) {
            Alert.alert("Reset Failed", error.message || "Something went wrong");
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={[colors.darkNavy, colors.lightBlue]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
                Enter your email and we'll send you a password reset link.
            </Text>

        <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
        />

        <Pressable style={styles.button} onPress={handleResetPassword}>
            <Text style={styles.buttonText}>Send Reset Email</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/(auth)/login")}>
            <Text style={styles.link}>Back to Login</Text>
        </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "600",
        marginBottom: 12,
        color: "#FFFFFF",
    },
    subtitle: {
        fontSize: 14,
        color: "#CBD5E1",
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#2323FF",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    button: {
        backgroundColor: "#2323FF",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 8,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
    },
    link: {
        marginTop: 14,
        color: "#2323FF",
        textAlign: "center",
        fontWeight: "500",
    },
});