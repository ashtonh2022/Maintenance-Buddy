import { StyleSheet, Text, View } from "react-native";

export default function ManageSchedule() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Schedule management coming soon.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
    text: { color: "#666", fontSize: 16 },
});
