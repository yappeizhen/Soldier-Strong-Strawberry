import { createUserWithEmailAndPassword } from "firebase/auth";
import React from "react";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Snackbar } from "react-native-paper";

import CustomButton from "../components/CustomButton";
import CustomTextInput from "../components/CustomInputText";
import * as firebase from "../firebase/firebase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const auth = firebase.auth;
  const handleSignup = () => {
    createUserWithEmailAndPassword(auth, email.trim(), password)
      .then(() => {
        console.log("User account created and signed in!");
      })
      .catch((error: any) => {
        if (error.code === "auth/email-already-in-use") {
          console.log("That email address is already in use!");
        }

        if (error.code === "auth/invalid-email") {
          console.log("That email address is invalid!");
        }

        console.error(error);
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
          onPress={handleSignup}
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
