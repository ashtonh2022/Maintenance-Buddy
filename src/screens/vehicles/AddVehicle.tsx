import { useAuth } from "@/contexts/AuthContext";
import { useAddVehicle } from "@/hooks/useVehicles";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";


//variables
export default function AddVehicle() {
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState("");
    const [mileage, setMileage] = useState("");

    const addVehicle = useAddVehicle();
    const { session } = useAuth();

    //function for button
    const handleAddVehicle = () => {
        if (!session?.user?.id) return;
      //if user leaves any fields empty prompts error message
      if (!make || !model || !year || !mileage) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }

      //creates vehicle object with inputed information
      const newVehicle = {
        make,
        model,
        year: Number(year), 
        recent_mileage: Number(mileage),
        user_id: session.user.id
      };

      addVehicle.mutate(newVehicle);

        //popup letting user know vehicle was added then routes back to dashboard
      Alert.alert("Success", "Vehicle added", [{text: "OK", onPress: () => router.back(),},]);
    };

  //screen display
  return (
      <View style={styles.container}>
      <Text style={styles.title}>Add Vehicle</Text>

      <TextInput
          style={styles.input}
          placeholder="Make"
          value={make}
          onChangeText={setMake}
      />

      <TextInput
          style={styles.input}
          placeholder="Model"
          value={model}
          onChangeText={setModel}
      />

      <TextInput
          style={styles.input}
          placeholder="Year"
          value={year}
          onChangeText={setYear}
          keyboardType="numeric" //displays keypad
      />

      <TextInput
          style={styles.input}
          placeholder="Mileage"
          value={mileage}
          onChangeText={setMileage}
          keyboardType="numeric" //displays keypad
      />

      <Pressable style={styles.button} onPress={handleAddVehicle}>
      <Text style={styles.buttonText}>Add Vehicle</Text>
      </Pressable>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,

      //backround white, will need to be updated for dark mode in settings
      backgroundColor: "#fff",
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
});