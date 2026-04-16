import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function AppointmentDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();

    return (
        <View>
            <Text>Appointment ID: {id}</Text>
        </View>
    );
}

