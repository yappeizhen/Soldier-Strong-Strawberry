import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { Card } from "react-native-paper";

import CustomButton from "../components/CustomButton";
import CustomTextInput from "../components/CustomInputText";
import CustomSnackBar from "../components/CustomSnackBar";
import { ScrollView, Text, View } from "../components/Themed";
import { firebaseFirestore } from "../firebase/firebase";
import { useAuthState } from "../hooks/useAuthState";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import EditScreenInfo from "../components/EditScreenInfo";




export default function IpptCalculatorScreen() {

  const [snackBarMessage, setSnackBarMessage] = useState<string>("");
  const [isSnackBarVisible, setIsSnackBarVisible] = useState<boolean>(false);
  const [pushups, setPushups] = useState<string>("");
  const [situps, setSitups] = useState<string>("");
  const [runtime, setRuntime] = useState<string>("");

  const { user } = useAuthState();

  const colorScheme = useColorScheme();

  return (
    <ScrollView style={styles.container}>
      <CustomSnackBar
        type="success"
        visible={isSnackBarVisible}
        onDismiss={() => {
          setSnackBarMessage("");
          setIsSnackBarVisible(false);
        }}
        message={snackBarMessage}
      />
      <CustomTextInput
        mode="flat"
        label="Push-ups"
        keyboardType={'numeric'}
        maxLength={2}
        onChangeText={() => {}}
      />
      <CustomTextInput
        mode="flat"
        label="Sit-ups"
        keyboardType={'numeric'}
        maxLength={2}
        onChangeText={() => {}}
      />
      <Card style={stylesRun.cardMain}>
      <Card.Title titleStyle={{color: Colors[colorScheme].tint, marginBottom:0, marginLeft: -10}}
                  title="2.4km Run Time"></Card.Title>
      <Card.Content style={stylesRun.container}>
      <CustomTextInput style={[stylesRun.card, stylesRun.cardRight]}
        mode="flat"
        label="mins"
        keyboardType={'numeric'}
        onChangeText={() => {}}
      />
      <CustomTextInput style={[stylesRun.card, stylesRun.cardLeft]}
        mode="flat"
        label="secs"
        keyboardType={'numeric'}
        onChangeText={() => {}}
      />
      </Card.Content>
      </Card>
    </ScrollView>
  );
}



const styles = StyleSheet.create({
  topButtonContainer: {
    flexDirection: "row",
  },
  radioButtonSet: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioHeader: {
    fontSize: 12,
    color: Colors["light"].tint,
  },
  radioButtonsContainer: {
    marginTop: 4,
    flexDirection: "column",
  },
  radioContainer: {
    padding: 12,
  },
  container: {
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});

const stylesRun = StyleSheet.create({
  card: {
    width: "40%",
    // borderWidth: 5,
    margin: -5,
    marginTop: -15
  },
  cardLeft: {
    marginLeft: "5%",
  },
  cardRight: {
    marginRight: "5%",
  },
  container: {
    display: "flex",
    flexDirection:"row",
    flex: 1,
    // borderWidth: 5,
    marginLeft: -10
  },
  cardMain: {
    elevation: 0,
  	shadowOpacity: 0,
    // borderWidth: 5,
    margin: 0
  }
});
