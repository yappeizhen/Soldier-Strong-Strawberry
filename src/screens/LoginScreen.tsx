import { signInWithEmailAndPassword } from "firebase/auth";
import React from "react";
import { useState } from "react";
import { Image, StyleSheet, View } from "react-native";

import CustomButton from "../components/CustomButton";
import CustomTextInput from "../components/CustomInputText";
import CustomSnackBar from "../components/CustomSnackBar";
import { ScrollView } from "../components/Themed";
import Colors from "../constants/Colors";
import { firebaseAuth } from "../firebase/firebase";
import useColorScheme from "../hooks/useColorScheme";

export default function LoginScreen({ navigation }: any) {
  const colorScheme = useColorScheme();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [snackIsVisible, setSnackIsVisible] = useState<boolean>(false);
  const [snackMessage, setSnackMessage] = useState<string>("");

  const handleLogin = () => {
    signInWithEmailAndPassword(firebaseAuth, email.trim(), password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user.email, "successfully signed in!");
      })
      .catch((error: any) => {
        if (error.code === "auth/wrong-password") {
          setSnackMessage("Incorrect password");
        } else if (error.code === "auth/invalid-email" || !email) {
          setSnackMessage("Invalid email");
        } else if (error.code === "auth/user-not-found") {
          setSnackMessage("User email not found");
        } else {
          setSnackMessage(error.message);
          console.log(error);
        }
        setSnackIsVisible(true);
        // console.log(error.code);
      });
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 40,
          marginTop: "10%",
        }}
      >
        <Image
          style={{ height: 260, width: 260 }}
          source={require("../assets/logos/soldierStrongLogo.png")}
        />
      </View>
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
      <CustomSnackBar
        visible={snackIsVisible}
        onDismiss={() => {
          setSnackIsVisible(false);
        }}
        type="error"
        message={snackMessage}
      ></CustomSnackBar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 30,
    width: 160,
  },
});
