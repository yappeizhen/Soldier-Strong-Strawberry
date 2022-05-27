import { createUserWithEmailAndPassword } from "firebase/auth";
import React from "react";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import CustomButton from "../components/CustomButton";
import CustomTextInput from "../components/CustomInputText";
import CustomSnackBar from "../components/CustomSnackBar";
import * as firebase from "../firebase/firebase";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [snackIsVisible, setSnackIsVisible] = useState<boolean>(false);
  const [snackMessage, setSnackMessage] = useState<string>("");

  const auth = firebase.auth;
  const handleSignup = () => {
    createUserWithEmailAndPassword(auth, email.trim(), password)
      .then((userCredential) => {
        console.log(userCredential.user.email, "signed in successfully");
      })
      .catch((error: any) => {
        if (error.code === "auth/email-already-in-use") {
          setSnackMessage("Email already in use");
        } else if (error.code === "auth/invalid-email") {
          setSnackMessage("Please enter a valid email address");
        } else {
          setSnackMessage(error.message);
        }
        setSnackIsVisible(true);
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
      <CustomSnackBar
        visible={snackIsVisible}
        onDismiss={() => {
          setSnackIsVisible(false);
        }}
        type="error"
        message={snackMessage}
      ></CustomSnackBar>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 30,
    width: 160,
  },
});
