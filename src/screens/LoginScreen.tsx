import { signInWithEmailAndPassword } from "firebase/auth";
import React from "react";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import CustomButton from "../components/CustomButton";
import CustomTextInput from "../components/CustomInputText";
import Colors from "../constants/Colors";
import { auth } from "../firebase/firebase";
import useColorScheme from "../hooks/useColorScheme";

export default function LoginScreen({ navigation }: any) {
  const colorScheme = useColorScheme();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email.trim(), password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(`${user.email} signed in!`);
      })
      .catch((error: any) => {
        console.error(error.message);
      });
  };

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
        <CustomTextInput label="Email" onChangeText={setEmail} value={email} />
        <CustomTextInput
          label="Password"
          onChangeText={setPassword}
          secureTextEntry={true}
          value={password}
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
          style={[styles.button, { marginBottom: 12 }]}
          onPress={handleLogin}
        >
          SIGN IN
        </CustomButton>
        <CustomButton
          mode="outlined"
          color={Colors[colorScheme].tint}
          style={styles.button}
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

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 30,
    width: 160,
  },
});
