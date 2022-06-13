import { doc, onSnapshot, startAfter, updateDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { Card, DataTable } from "react-native-paper";

import { stringify } from "@firebase/util";

import CustomButton from "../components/CustomButton";
import CustomTextInput from "../components/CustomInputText";
import CustomSnackBar from "../components/CustomSnackBar";
import EditScreenInfo from "../components/EditScreenInfo";
import { ScrollView, View } from "../components/Themed";
import Colors from "../constants/Colors";
import {
  FirestoreRunningStat,
  FirestoreStaticStat,
  RunningStat,
  StaticStat,
} from "../constants/Models";
import { firebaseFirestore } from "../firebase/firebase";
import { useAuthState } from "../hooks/useAuthState";
import useColorScheme from "../hooks/useColorScheme";

export default function IpptCalculatorScreen() {
  const [snackBarMessage, setSnackBarMessage] = useState<string>("");
  const [isSnackBarVisible, setIsSnackBarVisible] = useState<boolean>(false);
  const [pushups, setPushups] = useState<string>("0");
  const [situps, setSitups] = useState<string>("0");
  const [runtime, setRuntime] = useState<string>("1100");
  const [runtimeMins, setRuntimeMins] = useState<string>(
    Math.floor(parseInt(runtime) / 60).toString()
  );
  const [runtimeSecs, setRuntimeSecs] = useState<string>(
    (parseInt(runtime) % 60).toString()
  );
  const [age, setAge] = useState<number>(18);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<any>();
  const [pushupArray, setPushupArray] = useState<StaticStat[]>([]);
  const [situpArray, setSitupArray] = useState<StaticStat[]>([]);
  const [runtimeArray, setRuntimeArray] = useState<RunningStat[]>([]);

  const pushupTable = require("../constants/ippt/pushup.json");
  const situpTable = require("../constants/ippt/situp.json");
  const runningTable = require("../constants/ippt/run.json");

  const { user } = useAuthState();

  useEffect(() => {
    const unsubscribe = () => {
      if (user) {
        setCurrentUser(user);
        const userProfileRef = doc(firebaseFirestore, "userProfiles", user.uid);
        onSnapshot(userProfileRef, (snapshot) => {
          if (snapshot.exists()) {
            let pushupArrayTemp: StaticStat[] = [];
            let situpArrayTemp: StaticStat[] = [];
            let runtimeArrayTemp: RunningStat[] = [];
            snapshot.data().pushups?.forEach((stat: FirestoreStaticStat) => {
              pushupArrayTemp.push({
                number: stat.number,
                date: stat.date.toDate(),
              });
            });

            snapshot.data().situps?.forEach((stat: FirestoreStaticStat) => {
              situpArrayTemp.push({
                number: stat.number,
                date: stat.date.toDate(),
              });
            });

            snapshot
              .data()
              .runningData?.forEach((stat: FirestoreRunningStat) => {
                runtimeArrayTemp.push({
                  timing: stat.timing,
                  date: stat.date.toDate(),
                  distance: stat.distance,
                });
              });

            setPushupArray(pushupArrayTemp);
            setSitupArray(situpArrayTemp);
            setRuntimeArray(runtimeArrayTemp);

            let pushupRecent;
            if (
              snapshot.exists() &&
              snapshot.data().pushups &&
              snapshot.data().pushups.length > 0
            ) {
              pushupRecent = snapshot
                .data()
                .pushups?.sort(
                  (a: FirestoreStaticStat, b: FirestoreStaticStat) => {
                    if (b.date.toDate() === a.date.toDate()) {
                      // If the score is the same, show the more recent one first
                      return b.number - a.number;
                    }
                    return b.date.toDate() === a.date.toDate(); // Sort by decreasing number of pushups per session
                  }
                )[0];
            }
            pushupRecent = pushupRecent == undefined ? 0 : pushupRecent.number;

            let situpRecent;
            if (
              snapshot.exists() &&
              snapshot.data().situps &&
              snapshot.data().situps.length > 0
            ) {
              situpRecent = snapshot
                .data()
                .situps?.sort(
                  (a: FirestoreStaticStat, b: FirestoreStaticStat) => {
                    if (b.date.toDate() === a.date.toDate()) {
                      // If the score is the same, show the more recent one first
                      return b.number - a.number;
                    }
                    return b.date.toDate() === a.date.toDate(); // Sort by decreasing number of pushups per session
                  }
                )[0];
            }
            situpRecent =
              situpRecent?.number == undefined ? 0 : situpRecent.number;

            let runtime;
            if (
              snapshot.exists() &&
              snapshot.data().runtime &&
              snapshot.data().runtime.length > 0
            ) {
              runtime = snapshot
                .data()
                .runningData?.sort(
                  (a: FirestoreStaticStat, b: FirestoreStaticStat) => {
                    if (b.date.toDate() === a.date.toDate()) {
                      // If the score is the same, show the more recent one first
                      return b.number - a.number;
                    }
                    return b.date.toDate() === a.date.toDate(); // Sort by decreasing number of pushups per session
                  }
                )[0];
            }

            runtime = runtime?.timing == undefined ? 1100 : runtime.timing;
            let yearsDiff = 18;
            if (snapshot.data().birthday) {
              let birthday = snapshot.data().birthday?.toDate();
              const currDate: Date = new Date();
              yearsDiff = currDate.getFullYear() - birthday.getFullYear();
              if (currDate.getMonth() < birthday.getMonth()) {
                //get months when current month is greater
                yearsDiff--;
              } else if (
                currDate.getMonth() == birthday.getMonth() &&
                currDate.getDay() > birthday.getDay()
              ) {
                yearsDiff--;
              }
            }
            if (yearsDiff > 60) {
              yearsDiff = 60;
            } else if (yearsDiff < 18) {
              yearsDiff = 18;
            }
            // sort the values for pushup/situp/runtime by recency
            setPushups(pushupRecent.toString());
            setSitups(situpRecent.toString());
            setRuntime(runtime.toString());
            setRuntimeMins(Math.floor(parseInt(runtime) / 60).toString());
            setRuntimeSecs((runtime % 60).toString());
            setAge(yearsDiff);
          }
        });
      }
    };
    return unsubscribe();
  }, [user]);

  const colorScheme = useColorScheme();

  // create a new function to calculate score
  const exerciseScore = (
    table: any,
    stationVal: string,
    minVal: number,
    maxVal: number
  ): number => {
    if (parseInt(stationVal) > 99) {
      stationVal = (Math.ceil(parseInt(stationVal) / 10) * 10).toString();
    }
    if (stationVal === "" || parseInt(stationVal) < minVal) {
      return table[age.toString()][minVal.toString()];
    } else if (parseInt(stationVal) > maxVal) {
      return table[age.toString()][maxVal.toString()];
    } else {
      return table[age.toString()][parseInt(stationVal).toString()];
    }
  };

  const overallScore = () => {
    let pushUpScore = exerciseScore(pushupTable, pushups, 1, 60);
    let sitUpScore = exerciseScore(situpTable, situps, 1, 60);
    let runningScore = exerciseScore(runningTable, runtime, 510, 1100);
    setTotalScore(pushUpScore + sitUpScore + runningScore);
  };

  useEffect(() => {
    let runtimeSecsTemp = runtimeSecs === "" ? "0" : runtimeSecs;
    let runtimeMinsTemp = runtimeMins === "" ? "0" : runtimeMins;
    setRuntime(
      (parseInt(runtimeMinsTemp) * 60 + parseInt(runtimeSecsTemp)).toString()
    );
    overallScore();
  }, [pushups, situps, runtimeMins, runtimeSecs, runtime]);

  const saveEdits = () => {
    let pushupArrayTemp2 = pushupArray;
    let situpArrayTemp2 = situpArray;
    let runtimeArrayTemp2 = runtimeArray;
    pushupArrayTemp2.push({ date: new Date(), number: parseInt(pushups) });
    situpArrayTemp2.push({ date: new Date(), number: parseInt(situps) });
    runtimeArrayTemp2.push({
      date: new Date(),
      distance: 2400,
      timing: parseInt(runtime),
    });
    const newData = {
      pushups: pushupArrayTemp2 ?? null,
      situps: situpArrayTemp2 ?? null,
      runningData: runtimeArrayTemp2 ?? null,
    };
    const userProfileRef = doc(
      firebaseFirestore,
      "userProfiles",
      currentUser!.uid
    );
    updateDoc(userProfileRef, newData)
      .then(() => {
        setSnackBarMessage("Changes saved successfully!");
        setIsSnackBarVisible(true);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <ScrollView style={styles.container}>
      <View>
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
          keyboardType={"numeric"}
          maxLength={2}
          value={pushups}
          onChangeText={setPushups}
        />
        <CustomTextInput
          mode="flat"
          label="Sit-ups"
          keyboardType={"numeric"}
          maxLength={2}
          value={situps}
          onChangeText={setSitups}
        />
        <Card style={stylesRun.cardMain}>
          <Card.Title
            titleStyle={{
              color: Colors[colorScheme].tint,
              marginBottom: 0,
              marginLeft: -10,
            }}
            title="2.4km Run Time"
          ></Card.Title>
          <Card.Content style={stylesRun.container}>
            <CustomTextInput
              style={[stylesRun.card, stylesRun.cardRight]}
              mode="flat"
              label="mins"
              keyboardType={"numeric"}
              maxLength={2}
              value={runtimeMins}
              onChangeText={setRuntimeMins}
            />
            <CustomTextInput
              style={[stylesRun.card, stylesRun.cardLeft]}
              mode="flat"
              label="secs"
              keyboardType={"numeric"}
              maxLength={2}
              value={runtimeSecs}
              onChangeText={setRuntimeSecs}
            />
          </Card.Content>
        </Card>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Push-up</DataTable.Title>
            <DataTable.Title numeric>Sit-up</DataTable.Title>
            <DataTable.Title numeric>Run</DataTable.Title>
            <DataTable.Title numeric>Overall</DataTable.Title>
          </DataTable.Header>

          <DataTable.Row>
            <DataTable.Cell numeric>
              {exerciseScore(pushupTable, pushups, 1, 60)}
            </DataTable.Cell>
            <DataTable.Cell numeric>
              {exerciseScore(situpTable, situps, 1, 60)}
            </DataTable.Cell>
            <DataTable.Cell numeric>
              {exerciseScore(runningTable, runtime, 510, 1100)}
            </DataTable.Cell>
            <DataTable.Cell numeric>{totalScore}</DataTable.Cell>
          </DataTable.Row>
        </DataTable>
      </View>
      <View></View>
      <CustomButton style={styles.button} onPress={saveEdits}>
        Save Scores
      </CustomButton>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  topButtonContainer: {
    flexDirection: "row",
  },
  button: {
    marginTop: 24,
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
    height: 52,
  },
  cardLeft: {
    marginLeft: "5%",
  },
  cardRight: {
    marginRight: "5%",
  },
  container: {
    display: "flex",
    flexDirection: "row",
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
  },
});
