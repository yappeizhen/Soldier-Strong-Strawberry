import React from "react";
import { useState } from "react";
import { View } from "react-native";
import { TextInput } from "react-native-paper";
import { color } from "react-native-reanimated";

import CustomButton from "../components/CustomButton";
import CustomTextInput from "../components/CustomInputText";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

export default function LoginScreen({ navigation }: any) {
  const colorScheme = useColorScheme();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View
        style={{
          flex: 0.3,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 36,
        }}
      >
        <CustomTextInput label="Email" onChangeText={() => setEmail(email)} />
        <CustomTextInput
          label="Password"
          onChangeText={() => setPassword(password)}
        />
      </View>
      <View
        style={{
          flex: 0.3,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CustomButton
          mode="contained"
          style={{ width: 100, marginBottom: 12 }}
          onPress={() => {
            navigation.navigate("Register", { name: "Register" });
          }}
        >
          SIGN IN
        </CustomButton>
        <CustomButton
          mode="outlined"
          color={Colors[colorScheme].tint}
          style={{ width: 100 }}
          onPress={() => {
            navigation.navigate("Register", { name: "Register" });
          }}
        >
          SIGN UP
        </CustomButton>
      </View>
    </View>
  );
}
