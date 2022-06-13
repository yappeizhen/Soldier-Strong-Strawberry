import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import moment from "moment";
import { useEffect, useState } from "react";
import { Linking, StyleSheet } from "react-native";
import CountDown from "react-native-countdown-component";
import { Card } from "react-native-paper";

import CustomButton from "../../components/CustomButton";
import { Text } from "../../components/Themed";
import { ScrollView, View } from "../../components/Themed";
import { firebaseFirestore } from "../../firebase/firebase";
import { useAuthState } from "../../hooks/useAuthState";
import IPPTScore from "./IPPTScore"
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
<<<<<<< HEAD
          if (snapshot.exists() && snapshot.data().birthday) {
            let thisCycle: Date = snapshot.data().birthday?.toDate();
            const currentYear = new Date().getFullYear();
            thisCycle?.setFullYear(currentYear);
            let nextCycle: Date = snapshot.data().birthday?.toDate();
            nextCycle?.setFullYear(currentYear + 1);
=======
          if (snapshot.exists()) {
            let thisCycle: Date = new Date()
            let nextCycle: Date = new Date()
            if (snapshot.data().birthday) {
              thisCycle = snapshot.data().birthday.toDate();
              nextCycle = snapshot.data().birthday.toDate();
            }
            const currentYear = new Date().getFullYear();
            thisCycle.setFullYear(currentYear);
            nextCycle.setFullYear(currentYear + 1);
>>>>>>> 2684a27 (Commit all)
            if (thisCycle <= new Date()) {
              thisCycle = nextCycle;
              thisCycle.setMinutes(0);
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
      <IPPTScore />
      <View style={styles.container}>
        {endOfCycleDate ? (
          <Card style={styles.card}>
            <Card.Title
              title="End of IPPT Cycle"
              subtitle={endOfCycleDate.toDateString()}
            />
            <CountDown
              until={findHoursDiff(endOfCycleDate)}
              onFinish={() =>
                alert("Happy Birthday!! It's the end of yor IPPT cycle :)")
              }
              size={20}
              digitTxtStyle={{ fontWeight: "400" }}
              digitStyle={{ backgroundColor: "#266d9a" }}
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
              onFinish={() => alert("D-Day!!")}
              //on Press call
              size={20}
              digitTxtStyle={{ fontWeight: "400" }}
              digitStyle={{ backgroundColor: "#266d9a" }}
            />
          </Card>
        ) : (
          <></>
        )}
        {/* Link to IPPT website */}
        <Card style={styles.card}>
          <Card.Title title = "Link to NS Portal" />
            <Card.Content>
              <Text style={{marginBottom: 10}}>For more information, visit the NS Portal below: </Text>
              <CustomButton 
              onPress={() => {Linking.openURL('https://www.ns.sg/nsp/portal/site/login')}}
              >NS Portal</CustomButton>
            </Card.Content>
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
    padding: 20,
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
  subtitleText: {
  }
});
