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
import { IPPTScore } from "../../constants/Models";
import { firebaseFirestore } from "../../firebase/firebase";
import { useAuthState } from "../../hooks/useAuthState";

// To show most recent IPPT Score

export default function IPPTScore() {
  const [score, setScore] = useState<IPPTScore[]>([]);
  const { user } = useAuthState();
  useEffect(() => {
    const unsubscribe = () => {
      if (user) {
        const userProfileRef = doc(firebaseFirestore, "userProfiles", user.uid);
        onSnapshot(userProfileRef, (snapshot) => {
          if (snapshot.exists()) {
            setScore(snapshot.data().trainingPlan);
          }
        });
      }
    };
    return unsubscribe();
  }, [user]);
  const renderScore = () => {
    let displayedTrainingPlan = score;
    return (
      <DataTable>
        {displayedTrainingPlan.map((item, index) => {
          return (
            <DataTable.Row key={index}>
              <DataTable.Cell style={{ flex: 12 }}>
                <Text>{item.item}</Text>
              </DataTable.Cell>
              <DataTable.Cell>
                {!isTrainingDeleteMode ? (
                  <Checkbox.Android
                    color={Colors["light"].tint}
                    status={item.isComplete ? "checked" : "unchecked"}
                    onPress={() => {
                      item.isComplete = !item.isComplete;
                      setTrainingPlan(displayedTrainingPlan);
                      const userProfileRef = doc(
                        firebaseFirestore,
                        "userProfiles",
                        user!.uid
                      );
                      updateDoc(userProfileRef, {
                        trainingPlan: trainingPlan,
                      })
                        .then(() => {
                          console.log("Checkbox updated successfully!");
                        })
                        .catch((err) => {
                          console.log(err.message);
                        });
                    }}
                  />
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      removeTrainingItem(index);
                    }}
                  >
                    <MaterialCommunityIcons
                      name="delete-outline"
                      size={24}
                      color="grey"
                    />
                  </TouchableOpacity>
                )}
              </DataTable.Cell>
            </DataTable.Row>
          );
        })}
      </DataTable>
    );
  };

const styles = StyleSheet.create({
  button: {
    marginTop: 24,
  },
  card: {
    width: "80%",
    marginTop: 20,
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
});
