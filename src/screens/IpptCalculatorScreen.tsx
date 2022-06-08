import { StyleSheet } from "react-native";
import { TextInput, Button, Switch, HelperText } from "react-native-paper";
import {useForm, Controller, SubmitHandler} from 'react-hook-form';

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View, ScrollView } from "../components/Themed";

type FormData = {
  pushups: string
  situps: string
  runtime: string
}

export default function IpptCalculatorScreen() {
  const { control, errors, formState, handleSubmit } = useForm<FormData>({
    mode: "onChange",
  })

  const submit = (data) => console.log(data)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>IPPT Calculator</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="/screens/IpptCalculatorScreen.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
