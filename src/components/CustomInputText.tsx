import * as React from "react";
import { SetStateAction } from "react";
import { Dispatch } from "react";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import { TextInputLabelProp } from "react-native-paper/lib/typescript/components/TextInput/types";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

export type Props = {
  disabled?: boolean;
  editable?: boolean;
  mode?: "outlined" | "flat" | undefined;
  label?: TextInputLabelProp | undefined;
  placeholder?: string | undefined;
  placeholderTextColor?: string | undefined;
  textColor?: string | undefined;
  activeColor?: string | undefined;
  inactiveColor?: string | undefined;
  secureTextEntry?: boolean;
  style?: any;
  value?: string | undefined;
  onChangeText: Dispatch<SetStateAction<string>>;
  onPressIn?: () => void;
  keyboardType?: any;
  maxLength?: number | undefined;
};

export default function CustomTextInput({
  activeColor,
  disabled = false,
  editable = true,
  inactiveColor,
  label,
  mode = "flat",
  onChangeText,
  onPressIn,
  placeholder,
  placeholderTextColor,
  secureTextEntry = false,
  style,
  textColor,
  value,
  keyboardType,
  maxLength,
}: Props) {
  const colorScheme = useColorScheme();
  activeColor = activeColor ?? Colors[colorScheme].tint;
  inactiveColor = inactiveColor ?? Colors[colorScheme].tint;
  placeholderTextColor = placeholderTextColor ?? Colors[colorScheme].text;
  textColor = textColor ?? Colors[colorScheme].text;

  const styles = StyleSheet.create({
    customInputText: {
      width: 260,
      backgroundColor: "transparent",
    },
  });

  return (
    <TextInput
      activeUnderlineColor={activeColor}
      activeOutlineColor={activeColor}
      disabled={disabled}
      editable={editable}
      label={label}
      mode={mode}
      onChangeText={onChangeText}
      onPressIn={onPressIn}
      placeholder={placeholder}
      placeholderTextColor={placeholder}
      secureTextEntry={secureTextEntry}
      style={[styles.customInputText, style]}
      maxLength={maxLength}
      theme={{
        colors: {
          placeholder: inactiveColor,
          text: textColor,
        },
      }}
      underlineColor={inactiveColor}
      value={value}
      keyboardType={keyboardType}
    />
  );
}
