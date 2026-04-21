import { useSignIn } from "@/hooks/useAuth";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const signInMutation = useSignIn();

    //if either email or password are not inputed
    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        //displays message if successful then routes to dashboard otherwite shows error
        try {
            await signInMutation.mutateAsync({ email, password });
            Alert.alert("Success", "Logged in successfully", [{
                text: "OK",
                onPress: () => router.replace("/"),
            },]);
        } catch (error: any) {
            Alert.alert("Login Failed", error.message || "Something went wrong");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

        <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
        />

        <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
        />

        <Pressable style={styles.button} onPress={handleLogin} disabled={signInMutation.isPending}>
            <Text style={styles.buttonText}>
                {signInMutation.isPending ? "Logging in..." : "Login"}
            </Text>
        </Pressable>

        <Pressable onPress={() => router.push("/(auth)/reset-password")}>
            <Text style={styles.link}>Forgot Password?</Text>
        </Pressable>

        <Pressable onPress={() => router.push("/register")}>
            <Text style={styles.link}>Need an account? Sign up</Text>
        </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
        justifyContent: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "600",
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
        marginTop: 16,
        color: "#2323FF",
        textAlign: "center",
        fontWeight: "500",
    },
});
