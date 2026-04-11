import { StyleSheet, Text, View } from "react-native";

export default function Onboarding() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Onboarding coming soon.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
    text: { color: "#666", fontSize: 16 },
});
