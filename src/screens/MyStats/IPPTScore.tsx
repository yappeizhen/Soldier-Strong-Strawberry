import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Card, Checkbox, DataTable } from "react-native-paper";

import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import CustomTextInput from "../../components/CustomInputText";
import { ScrollView, Text, View } from "../../components/Themed";
import Colors from "../../constants/Colors";
import { ScoreIPPT } from "../../constants/Models";
import { firebaseFirestore } from "../../firebase/firebase";
import { useAuthState } from "../../hooks/useAuthState";

export default function IPPTScore() {
  // ScoreIPPT is imported from Models
  const [score, setScore] = useState<ScoreIPPT>();
  const [newTrainingItemName, setNewTrainingItemName] = useState<number>(0);
  const [isTrainingDeleteMode, setIsTrainingDeleteMode] =
    useState<boolean>(false);
  const { user } = useAuthState();
  useEffect(() => {
    const unsubscribe = () => {
      if (user) {
        const userProfileRef = doc(firebaseFirestore, "userProfiles", user.uid);
        onSnapshot(userProfileRef, (snapshot) => {
          if (snapshot.exists()) {
            // Getting the data from firebase .data()
            setScore(snapshot.data().mostRecentIpptScore);
            console.log(snapshot.data())
          }
        });
      }
    };
    return unsubscribe();
  }, [user]);
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Title
            title="Current IPPT Score"
          />
          <Card.Content>
            <View style={{width: "100%", alignItems: "center"}}>
              <Text style={styles.ipptText}>{score}</Text>
            </View>
          </Card.Content>
        </Card>
      </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginBottom: 24,
  },
  card: {
    width: "80%",
    marginTop: 20,
    marginBottom: 40,
    paddingBottom: 5
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginTop: 24,
    fontSize: 20,
    fontWeight: "bold",
  },
  ipptText: {
    fontSize: 50,
    fontWeight: "bold",
    fontFamily: "Arial",
    color: "red"
  }
});
