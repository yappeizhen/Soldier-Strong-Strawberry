import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import moment from "moment";
import { useState } from "react";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import CountDown from "react-native-countdown-component";
import { Card } from "react-native-paper";

import { ScrollView, View } from "../../components/Themed";
import { firebaseFirestore } from "../../firebase/firebase";
import { useAuthState } from "../../hooks/useAuthState";
import TrainingPlan from "./TrainingPlan";

export default function MyStatsScreen({ navigation }: any) {
  const [targetIPPTDate, setTargetIPPTDate] = useState<Date | undefined>();
  const [endOfCycleDate, setEndOfCycleDate] = useState<Date | undefined>();
  const { user } = useAuthState();
  useEffect(() => {
    const unsubscribe = () => {
      if (user) {
        const userProfileRef = doc(firebaseFirestore, "userProfiles", user.uid);
        onSnapshot(userProfileRef, (snapshot) => {
          if (snapshot.exists()) {
            let thisCycle: Date = snapshot.data().birthday?.toDate();
            const currentYear = new Date().getFullYear();
            thisCycle.setFullYear(currentYear);
            let nextCycle: Date = snapshot.data().birthday?.toDate();
            nextCycle.setFullYear(currentYear + 1);
            if (thisCycle <= new Date()) {
              thisCycle = nextCycle;
            }
            setTargetIPPTDate(snapshot.data().intendedIpptDate?.toDate());
            setEndOfCycleDate(thisCycle);
          }
        });
      }
    };
    return unsubscribe();
  }, [user]);
  const findHoursDiff = (inputDate: Date) => {
    const date = inputDate;
    //Getting the current date-time with required formate and UTC
    let today = moment().format("YYYY-MM-DD hh:mm:ss");
    //Let suppose we have to show the countdown for above date-time
    let diffr = moment(date).diff(moment(today));
    //difference of the expiry date-time given and current date-time
    return diffr / 1000;
  };
  return (
    <ScrollView>
      <TrainingPlan />
      <View style={styles.container}>
        {endOfCycleDate ? (
          <Card style={styles.card}>
            <Card.Title
              title="End of IPPT Cycle"
              subtitle={endOfCycleDate.toDateString()}
            />
            <CountDown
              until={findHoursDiff(endOfCycleDate)}
              //formate to show
              onFinish={() => alert("finished")}
              //on Finish call
              onPress={() => alert("hello")}
              //on Press call
              size={20}
              digitStyle={{ backgroundColor: "#90c2e0" }}
            />
          </Card>
        ) : (
          <></>
        )}
        {targetIPPTDate ? (
          <Card style={styles.card}>
            <Card.Title
              title="Target IPPT Date"
              subtitle={targetIPPTDate.toDateString()}
            />
            <CountDown
              until={findHoursDiff(targetIPPTDate)}
              //formate to show
              onFinish={() => alert("finished")}
              //on Finish call
              onPress={() => alert("hello")}
              //on Press call
              size={20}
              digitStyle={{ backgroundColor: "#90c2e0" }}
            />
          </Card>
        ) : (
          <></>
        )}
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
    padding: 16,
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
