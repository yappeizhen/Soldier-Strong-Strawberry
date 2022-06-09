import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { StyleSheet } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { RadioButton } from "react-native-paper";

import CustomButton from "../components/CustomButton";
import CustomTextInput from "../components/CustomInputText";
import CustomSnackBar from "../components/CustomSnackBar";
import { ScrollView, Text, View } from "../components/Themed";
import Colors from "../constants/Colors";
import { firebaseFirestore } from "../firebase/firebase";
import { useAuthState } from "../hooks/useAuthState";
import useColorScheme from "../hooks/useColorScheme";

export default function EditProfileScreen() {
  const [snackBarMessage, setSnackBarMessage] = useState<string>("");
  const [isSnackBarVisible, setIsSnackBarVisible] = useState<boolean>(false);

  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState<Date | undefined>();
  const [gender, setGender] = useState<string>("");
  const [mostRecentIpptScore, setMostRecentIpptScore] = useState<string>("");
  const [vocation, setVocation] = useState<string>("");
  const [intendedIpptDate, setIntendedIpptDate] = useState<Date | undefined>();

  const colorScheme = useColorScheme();

  const [isBirthdayModalOpen, setIsBirthdayModalOpen] = useState(false);
  const [isTargetIpptDateModalOpen, setIsTargetIpptDateModalOpen] =
    useState(false);

  const { user } = useAuthState();
  useEffect(() => {
    const unsubscribe = () => {
      if (user) {
        setCurrentUser(user);
        const userProfileRef = doc(firebaseFirestore, "userProfiles", user.uid);
        onSnapshot(userProfileRef, (snapshot) => {
          if (snapshot.exists()) {
            const userProfileData = snapshot.data();
            setName(userProfileData.name);
            setEmail(userProfileData.email);
            setBirthday(userProfileData.birthday?.toDate());
            setIntendedIpptDate(userProfileData.intendedIpptDate?.toDate());
            !userProfileData.mostRecentIpptScore ??
              setMostRecentIpptScore(
                userProfileData.mostRecentIpptScore.toString()
              );
            if (userProfileData.isMale !== null) {
              userProfileData.isMale ? setGender("male") : setGender("female");
            }
            if (userProfileData.isDiverCommandoGuards !== null) {
              userProfileData.isDiverCommandoGuards
                ? setVocation("Diver/Commando/Guards")
                : setVocation("NSF/NSMen");
            }
          }
        });
      }
    };
    return unsubscribe();
  }, [user]);

  const saveEdits = () => {
    const isMale = gender === "male";
    const isDiverCommandoGuards = vocation === "Diver/Commando/Guards";
    const newData = {
      name: name,
      birthday: birthday ?? null,
      isMale: isMale ?? null,
      mostRecentIpptScore: mostRecentIpptScore ?? null,
      isDiverCommandoGuards: isDiverCommandoGuards ?? null,
      intendedIpptDate: intendedIpptDate ?? null,
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
  const renderEditingMode = () => {
    if (!isEditingMode) {
      return (
        <CustomButton
          style={{ fontWeight: 200 }}
          onPress={() => {
            setIsEditingMode(true);
          }}
        >
          Edit Profile
        </CustomButton>
      );
    } else {
      return (
        <CustomButton
          mode="contained"
          style={{ fontWeight: 200 }}
          onPress={() => {
            setIsEditingMode(false);
            saveEdits();
          }}
        >
          Save Changes
        </CustomButton>
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      {renderEditingMode()}
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
        label="Email"
        disabled={true}
        value={email}
        onChangeText={() => {}}
      />
      <CustomTextInput
        disabled={!isEditingMode}
        mode="flat"
        label="Name"
        value={name}
        onChangeText={setName}
      />
      <CustomTextInput
        editable={false}
        disabled={!isEditingMode}
        mode="flat"
        label="Birthday"
        value={birthday ? birthday.toDateString() : birthday}
        onChangeText={() => {}}
        onPressIn={() => setIsBirthdayModalOpen(true && isEditingMode)}
      />
      <DateTimePickerModal
        isVisible={isBirthdayModalOpen && isEditingMode}
        mode="date"
        date={birthday}
        onCancel={() => {
          setIsBirthdayModalOpen(false);
        }}
        onConfirm={(value) => {
          setBirthday(value);
          setIsBirthdayModalOpen(false);
        }}
      />
      <RadioButton.Group
        value={gender}
        onValueChange={(val) => {
          setGender(val);
        }}
      >
        <View style={styles.radioContainer}>
          <Text style={styles.radioHeader}>Gender</Text>
          <View style={styles.radioButtonsContainer}>
            <View style={styles.radioButtonSet}>
              <RadioButton.Android
                disabled={!isEditingMode}
                uncheckedColor={Colors[colorScheme].tint}
                color={Colors[colorScheme].tint}
                value="male"
              />
              <Text>Male</Text>
            </View>
            <View style={styles.radioButtonSet}>
              <RadioButton.Android
                disabled={!isEditingMode}
                uncheckedColor={Colors[colorScheme].tint}
                color={Colors[colorScheme].tint}
                value="female"
              />
              <Text>Female</Text>
            </View>
          </View>
        </View>
      </RadioButton.Group>
      <RadioButton.Group
        value={vocation}
        onValueChange={(val) => {
          setVocation(val);
        }}
      >
        <View style={styles.radioContainer}>
          <Text style={styles.radioHeader}>Vocation</Text>
          <View style={styles.radioButtonsContainer}>
            <View style={styles.radioButtonSet}>
              <RadioButton.Android
                disabled={!isEditingMode}
                uncheckedColor={Colors[colorScheme].tint}
                color={Colors[colorScheme].tint}
                value="NSF/NSMen"
              />
              <Text>NSF/NSMen</Text>
            </View>
            <View style={styles.radioButtonSet}>
              <RadioButton.Android
                disabled={!isEditingMode}
                uncheckedColor={Colors[colorScheme].tint}
                color={Colors[colorScheme].tint}
                value="Diver/Commando/Guards"
              />
              <Text>Diver/Commando/Guards</Text>
            </View>
          </View>
        </View>
      </RadioButton.Group>
      <CustomTextInput
        disabled={!isEditingMode}
        mode="flat"
        label="Latest IPPT Score"
        value={mostRecentIpptScore}
        onChangeText={setMostRecentIpptScore}
        keyboardType="numeric"
      />
      <CustomTextInput
        disabled={!isEditingMode}
        editable={false}
        mode="flat"
        label="Target IPPT Date"
        value={
          intendedIpptDate ? intendedIpptDate.toDateString() : intendedIpptDate
        }
        onChangeText={() => {}}
        onPressIn={() => setIsTargetIpptDateModalOpen(true && isEditingMode)}
      />
      <DateTimePickerModal
        isVisible={isTargetIpptDateModalOpen && isEditingMode}
        mode="date"
        date={intendedIpptDate}
        onCancel={() => {
          setIsTargetIpptDateModalOpen(false);
        }}
        onConfirm={(value) => {
          setIntendedIpptDate(value);
          setIsTargetIpptDateModalOpen(false);
        }}
      />
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
