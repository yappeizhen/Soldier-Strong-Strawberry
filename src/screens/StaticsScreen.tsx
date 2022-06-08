import { doc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { Card, DataTable } from "react-native-paper";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import CustomButton from "../components/CustomButton";
import { ScrollView, Text, View } from "../components/Themed";
import { FirestoreStaticStat, StaticStat } from "../constants/Models";
import { firebaseFirestore } from "../firebase/firebase";
import { useAuthState } from "../hooks/useAuthState";

export default function StaticsScreen({ navigation }: any) {
  const [pushupData, setPushupData] = useState<StaticStat[]>([]);
  const [situpData, setSitupData] = useState<StaticStat[]>([]);

  const { user } = useAuthState();
  useEffect(() => {
    const unsubscribe = () => {
      if (user) {
        const userProfileRef = doc(firebaseFirestore, "userProfiles", user.uid);
        onSnapshot(userProfileRef, (snapshot) => {
          const pushupArray: StaticStat[] = [];
          if (snapshot.exists()) {
            snapshot
              .data()
              .pushups?.sort(
                (a: FirestoreStaticStat, b: FirestoreStaticStat) => {
                  if (b.number === a.number) {
                    // If the score is the same, show the more recent one first
                    if (a.date.toDate() > b.date.toDate()) {
                      return -1;
                    } else {
                      return 1;
                    }
                  }
                  return b.number - a.number; // Sort by decreasing number of pushups per session
                }
              )
              .slice(0, 3) // Get only the top 3 results
              .forEach((stat: FirestoreStaticStat) => {
                pushupArray.push({
                  number: stat.number,
                  date: stat.date.toDate(),
                });
              });
            setPushupData(pushupArray);

            // Get Situps Data
            const situpArray: StaticStat[] = [];
            snapshot
              .data()
              .situps?.sort(
                (a: FirestoreStaticStat, b: FirestoreStaticStat) => {
                  if (b.number === a.number) {
                    // If the score is the same, show the more recent one first
                    if (a.date.toDate() > b.date.toDate()) {
                      return -1;
                    } else {
                      return 1;
                    }
                  }
                  return b.number - a.number; // Sort by decreasing number of pushups per session
                }
              )
              .slice(0, 3) // Get only the top 3 results
              .forEach((stat: FirestoreStaticStat) => {
                situpArray.push({
                  number: stat.number,
                  date: stat.date.toDate(),
                });
              });
            setSitupData(situpArray);
          }
        });
      }
    };
    return unsubscribe();
  }, [user]);
  const renderStaticsData = (type: "pushups" | "situps") => {
    let staticData;
    if (type === "pushups") {
      staticData = pushupData;
    } else {
      staticData = situpData;
    }
    if (!staticData || staticData.length === 0) {
      return <Text>Start a new session and track your progress here!</Text>;
    } else {
      return (
        <DataTable>
          <DataTable.Header>
            <DataTable.Title style={styles.tableCrownCell}>
              <MaterialCommunityIcons
                name="crown-outline"
                size={24}
                color="gold"
              />
            </DataTable.Title>
            <DataTable.Title style={styles.tableScoreCell}>
              Score
            </DataTable.Title>
            <DataTable.Title style={styles.tableDateCell}>Date</DataTable.Title>
          </DataTable.Header>
          {staticData.map((item, index) => {
            return (
              <DataTable.Row key={index}>
                <DataTable.Cell style={styles.tableCrownCell}>
                  {index + 1}
                </DataTable.Cell>
                <DataTable.Cell style={styles.tableScoreCell}>
                  {item.number}
                </DataTable.Cell>
                <DataTable.Cell style={styles.tableDateCell}>
                  {item.date.toLocaleDateString()}
                </DataTable.Cell>
              </DataTable.Row>
            );
          })}
        </DataTable>
      );
    }
  };
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>My Statics Tracker</Text>
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
        <Card style={styles.card}>
          <Card.Title title="Push Ups" subtitle="Highscores" />
          <Card.Content>
            {renderStaticsData("pushups")}
            <CustomButton
              style={styles.button}
              onPress={() => {
                navigation.navigate("Pushups");
              }}
            >
              Start new session
            </CustomButton>
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Title title="Sit Ups" subtitle="Highscores" />
          <Card.Content>
            {renderStaticsData("situps")}
            <CustomButton
              style={styles.button}
              onPress={() => {
                navigation.navigate("Situps");
              }}
            >
              Start new session
            </CustomButton>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tableCrownCell: {
    flex: 0.3,
  },
  tableScoreCell: {
    flex: 0.3,
  },
  tableDateCell: {
    flex: 0.45,
  },
  button: {
    marginTop: 24,
  },
  card: {
    width: "80%",
    marginBottom: 20,
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
  separator: {
    marginVertical: 20,
    height: 1,
    width: "80%",
  },
});
