import * as React from "react";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

export type Props = {
  mode?: "outlined" | "text" | "contained" | undefined;
  color?: any;
  children: React.ReactElement<any> | String;
  style?: any;
  uppercase?: boolean;
  onPress: () => void;
};

export default function CustomButton({
  color,
  children,
  mode = "outlined",
  style,
  uppercase = false,
  onPress,
}: Props) {
  const colorScheme = useColorScheme();
  color = color ?? Colors[colorScheme].tint;

  const styles = StyleSheet.create({
    customButton: {
      borderColor: color,
    },
  });

  return (
    <Button
      mode={mode}
      color={color}
      onPress={onPress}
      uppercase={uppercase}
      style={[styles.customButton, style]}
    >
      {children}
    </Button>
  );
}
