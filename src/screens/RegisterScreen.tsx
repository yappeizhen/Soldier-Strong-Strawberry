import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React from "react";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import CustomButton from "../components/CustomButton";
import CustomTextInput from "../components/CustomInputText";
import CustomSnackBar from "../components/CustomSnackBar";
import { UserProfileData } from "../constants/Models";
import { firebaseAuth, firebaseFirestore } from "../firebase/firebase";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [snackIsVisible, setSnackIsVisible] = useState<boolean>(false);
  const [snackMessage, setSnackMessage] = useState<string>("");

  const handleSignup = () => {
    if (!name) {
      setSnackIsVisible(true);
      setSnackMessage("Please enter your name");
      return;
    }
    createUserWithEmailAndPassword(firebaseAuth, email.trim(), password)
      .then((userCredential) => {
        console.log(userCredential.user.email, "signed in successfully");
        try {
          const newUserProfile: UserProfileData = {
            email: userCredential.user.email!,
            name: name,
            birthday: null,
            isMale: true,
            mostRecentIpptScore: null,
            isDiverCommandoGuards: false,
            intendedIpptDate: null,
            trainingPlan: [],
            pushups: [],
            situps: [],
            runningData: [],
          };
          setDoc(
            doc(firebaseFirestore, "userProfiles", userCredential.user.uid),
            newUserProfile
          );
        } catch (error: any) {
          console.error("Error saving user: ", error.message);
        }
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
          marginBottom: 88,
        }}
      >
        <CustomTextInput label="Name" onChangeText={setName} value={name} />
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
