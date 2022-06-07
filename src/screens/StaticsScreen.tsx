import { doc, onSnapshot } from "firebase/firestore";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { Card } from "react-native-paper";

import { ScrollView, Text, View } from "../components/Themed";
import { FirestoreStaticStat, StaticStat } from "../constants/Types";
import { firebaseFirestore } from "../firebase/firebase";
import { useAuthState } from "../hooks/useAuthState";

export default function StaticsScreen() {
  const [pushupData, setPushupData] = useState<StaticStat[]>([]);
  const [situpData, setSitupData] = useState<StaticStat[]>([]);

  const { user } = useAuthState();
  if (user) {
    onSnapshot(doc(firebaseFirestore, "userProfiles", user.uid), (snapshot) => {
      const pushupArray: StaticStat[] = [];
      if (snapshot.exists()) {
        snapshot
          .data()
          .pushups?.sort((a: FirestoreStaticStat, b: FirestoreStaticStat) => {
            if (b.number === a.number) {
              // If the score is the same, show the more recent one first
              if (a.date.toDate() > b.date.toDate()) {
                return -1;
              } else {
                return 1;
              }
            }
            return b.number - a.number; // Sort by decreasing number of pushups per session
          })
          .slice(0, 3) // Get only the top 3 results
          .forEach((stat: FirestoreStaticStat) => {
            pushupArray.push({ number: stat.number, date: stat.date.toDate() });
          });
        setPushupData(pushupArray);

        // Get Situps Data
        const situpArray: StaticStat[] = [];
        snapshot
          .data()
          .situps?.sort((a: FirestoreStaticStat, b: FirestoreStaticStat) => {
            if (b.number === a.number) {
              // If the score is the same, show the more recent one first
              if (a.date.toDate() > b.date.toDate()) {
                return -1;
              } else {
                return 1;
              }
            }
            return b.number - a.number; // Sort by decreasing number of pushups per session
          })
          .slice(0, 3) // Get only the top 3 results
          .forEach((stat: FirestoreStaticStat) => {
            situpArray.push({ number: stat.number, date: stat.date.toDate() });
          });
        setSitupData(situpArray);
      }
    });
  }
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
      return staticData.map((item, index) => {
        return (
          <Text key={index}>
            {index + 1}: {item.number}, {item.date.toLocaleString()}
          </Text>
        );
      });
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
          <Card.Content>{renderStaticsData("pushups")}</Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Title title="Sit Ups" subtitle="Highscores" />
          <Card.Content>{renderStaticsData("situps")}</Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
