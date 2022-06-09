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
import { FirestoreStaticStat, StaticStat } from "../constants/Models";





export default function IpptCalculatorScreen() {

  const [snackBarMessage, setSnackBarMessage] = useState<string>("");
  const [isSnackBarVisible, setIsSnackBarVisible] = useState<boolean>(false);
  const [pushups, setPushups] = useState<number>();
  const [situps, setSitups] = useState<number>();
  const [runtime, setRuntime] = useState<number>();
  const [age, setAge] = useState<number>();
  const [totalScore, setTotalScore] = useState<number>();

  const pushupTable = require('../constants/ippt/pushup.json');
  const situpTable = require('../constants/ippt/situp.json');
  const runningTable = require('../constants/ippt/run.json');

  const { user } = useAuthState();

  useEffect(() => {
    const unsubscribe = () => {
      if (user) {
        const userProfileRef = doc(firebaseFirestore, "userProfiles", user.uid);
        onSnapshot(userProfileRef, (snapshot) => {
          if (snapshot.exists()) {

            let pushupRecent = snapshot
            .data()
            .pushups?.sort(
              (a: FirestoreStaticStat, b: FirestoreStaticStat) => {
                if (b.date.toDate() === a.date.toDate()) {
                  // If the score is the same, show the more recent one first
                  return b.number - a.number;
                }
                return b.date.toDate() === a.date.toDate(); // Sort by decreasing number of pushups per session
              }
            ).at(0);
            
            pushupRecent = pushupRecent == undefined ? 0 : pushupRecent;

            let situpRecent = snapshot
            .data()
            .situps?.sort(
              (a: FirestoreStaticStat, b: FirestoreStaticStat) => {
                if (b.date.toDate() === a.date.toDate()) {
                  // If the score is the same, show the more recent one first
                  return b.number - a.number;
                }
                return b.date.toDate() === a.date.toDate(); // Sort by decreasing number of pushups per session
              }
            ).at(0);
            
            situpRecent = situpRecent == undefined ? 0 : situpRecent;
            
            let runtime = snapshot
            .data()
            .situps?.sort(
              (a: FirestoreStaticStat, b: FirestoreStaticStat) => {
                if (b.date.toDate() === a.date.toDate()) {
                  // If the score is the same, show the more recent one first
                  return b.number - a.number;
                }
                return b.date.toDate() === a.date.toDate(); // Sort by decreasing number of pushups per session
              }
            ).at(0);
            
            runtime = runtime == undefined ? 1200 : runtime;

            let birthday: Date = snapshot.data().birthday?.toDate();
            const currDate : Date = new Date(); 
            let yearsDiff = birthday.getFullYear() - currDate.getFullYear();
            if (currDate.getMonth() < birthday.getMonth()) {
            //get months when current month is greater  
              yearsDiff--;
            } else if (currDate.getMonth() == birthday.getMonth() && 
            currDate.getDay() > birthday.getDay()) {
              yearsDiff--;
            }
            
            // sort the values for pushup/situp/runtime by recency
            setPushups(pushupRecent);
            setSitups(situpRecent);
            setRuntime(runtime);
            setAge(yearsDiff);
          }
        });
      }
    };
    return unsubscribe();
  }, [user]);

  const colorScheme = useColorScheme();

  // create a new function to calculate score
  const calculateScore = () => {
    let pushUpScore = 0;
    let sitUpScore = 0;
    let runningScore = 0;
    setTotalScore(0);
  }

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
    padding: 0,
    margin: -5,
    marginTop: -15,
    height: 52
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
    marginLeft: -10,
    padding: 0,
  },
  cardMain: {
    elevation: 0,
  	shadowOpacity: 0,
    // borderWidth: 5,
    margin: 0,
    padding: 0,
  }
});
