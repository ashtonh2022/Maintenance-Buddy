import { StyleSheet, Text, View } from "react-native";

export default function AddAppointment() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Add Appointment coming soon.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
    text: { color: "#666", fontSize: 16 },
});
