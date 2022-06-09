import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { Card } from "react-native-paper";

import { ScrollView, Text, View } from "../../components/Themed";
import TrainingPlan from "./TrainingPlan";

export default function MyStatsScreen({ navigation }: any) {
  return (
    <ScrollView>
      <TrainingPlan />
      <View style={styles.container}>
        <Card style={styles.card}>
          <Text>Add more stuff here</Text>
        </Card>
      </View>
    </ScrollView>
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
