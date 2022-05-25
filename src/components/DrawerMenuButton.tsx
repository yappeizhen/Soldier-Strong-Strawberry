import * as React from "react";
import { GestureResponderEvent } from "react-native";

import { AntDesign } from "@expo/vector-icons";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

export type Props = {
  onPress: (event: GestureResponderEvent) => void;
};

export default function DrawerMenuButton({ onPress }: Props) {
  const colorScheme = useColorScheme();
  return (
    <AntDesign
      name="bars"
      size={24}
      color={Colors[colorScheme].text}
      style={{ marginLeft: 15 }}
      onPress={onPress}
    />
  );
}
