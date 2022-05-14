import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

export default function RegisterScreen() {
  const colorScheme = useColorScheme();
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: Colors[colorScheme].text }}>
        Regsistration Screen
      </Text>
    </View>
  );
}
