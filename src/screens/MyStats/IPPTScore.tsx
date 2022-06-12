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
  const [score, setScore] = useState<ScoreIPPT[]>([]);
  const [newTrainingItemName, setNewTrainingItemName] = useState<string>("");
  const [isTrainingDeleteMode, setIsTrainingDeleteMode] =
    useState<boolean>(false);
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
    let displayedscore = score;
    return (
      <DataTable>
        {displayedscore.map((item, index) => {
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
                      setScore(displayedscore);
                      const userProfileRef = doc(
                        firebaseFirestore,
                        "userProfiles",
                        user!.uid
                      );
                      updateDoc(userProfileRef, {
                        score: score,
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
  const addTrainingItem = (name: string) => {
    const newItem = { item: name, isComplete: false };
    const newscore = score;
    newscore.push(newItem);
    setScore(newscore);
    const userProfileRef = doc(firebaseFirestore, "userProfiles", user!.uid);
    updateDoc(userProfileRef, { score: score })
      .then(() => {
        console.log("New activity added successfully!");
        setNewTrainingItemName("");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const removeTrainingItem = (index: number) => {
    const newscore = score;
    newscore.splice(index, 1);
    setScore(newscore);
    const userProfileRef = doc(firebaseFirestore, "userProfiles", user!.uid);
    updateDoc(userProfileRef, { score: score })
      .then(() => {
        console.log("Item deleted successfully!");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Title
            title = "Most Recent IPPT Score"
            right={() => {
              if (!isTrainingDeleteMode) {
                return (
                  <TouchableOpacity
                    style={{ marginRight: 24 }}
                    onPress={() => setIsTrainingDeleteMode(true)}
                  >
                    <AntDesign name="setting" size={24} color="black" />
                  </TouchableOpacity>
                );
              } else {
                return (
                  <TouchableOpacity
                    style={{ marginRight: 24 }}
                    onPress={() => setIsTrainingDeleteMode(false)}
                  >
                    <Feather name="save" size={24} color="black" />
                  </TouchableOpacity>
                );
              }
            }}
          />
          <Card.Content>
            {renderScore()}
            <DataTable.Row
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <CustomTextInput
                  mode="outlined"
                  value={newTrainingItemName}
                  onChangeText={setNewTrainingItemName}
                  style={{ padding: 0, height: 32, width: "85%" }}
                />
                <TouchableOpacity
                  onPress={() => {
                    if (newTrainingItemName) {
                      addTrainingItem(newTrainingItemName);
                    }
                  }}
                  disabled={!newTrainingItemName}
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={28}
                    color={
                      newTrainingItemName ? Colors["light"].tint : "lightgrey"
                    }
                    style={{ margin: 12 }}
                  />
                </TouchableOpacity>
              </View>
            </DataTable.Row>
          </Card.Content>
        </Card>
      </View>
  );
}

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
