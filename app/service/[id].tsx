import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function ServiceDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();

    return (
        <View>
            <Text>Service Event ID: {id}</Text>
        </View>
    );
}
