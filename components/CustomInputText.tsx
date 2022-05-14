import * as React from "react";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import { TextInputLabelProp } from "react-native-paper/lib/typescript/components/TextInput/types";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

export type Props = {
  mode?: "outlined" | "flat" | undefined;
  label?: TextInputLabelProp | undefined;
  placeholder?: string | undefined;
  placeholderTextColor?: string | undefined;
  textColor?: string | undefined;
  activeColor?: string | undefined;
  inactiveColor?: string | undefined;
  style?: any;
  value?: string | undefined;
  onChangeText: () => void;
};

export default function CustomTextInput({
  activeColor,
  inactiveColor,
  label,
  mode = "flat",
  onChangeText,
  placeholder,
  placeholderTextColor,
  style,
  textColor,
  value,
}: Props) {
  const colorScheme = useColorScheme();
  activeColor = activeColor ?? Colors[colorScheme].tint;
  inactiveColor = inactiveColor ?? Colors[colorScheme].tint;
  placeholderTextColor = placeholderTextColor ?? Colors[colorScheme].text;
  textColor = textColor ?? Colors[colorScheme].text;

  const styles = StyleSheet.create({
    customInputText: {
      width: 200,
      backgroundColor: "transparent",
    },
  });

  return (
    <TextInput
      activeUnderlineColor={activeColor}
      label={label}
      mode={mode}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={placeholder}
      style={[styles.customInputText, style]}
      theme={{
        colors: {
          placeholder: inactiveColor,
          text: textColor,
        },
      }}
      underlineColor={inactiveColor}
      value={value}
    />
  );
}
