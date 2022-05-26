import * as React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Button, Snackbar, Text } from "react-native-paper";

import { AntDesign, MaterialIcons } from "@expo/vector-icons";

export type Props = {
  visible: boolean;
  action?: Omit<React.ComponentProps<typeof Button>, "children"> & {
    label: string;
  };
  duration?: number;
  onDismiss: () => void;
  children?: React.ReactNode;
  message: string;
  wrapperStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  type?: "default" | "error" | "success" | "warning";
  defaultIcon?: boolean;
};

export default function CustomSnackBar({
  visible,
  action,
  duration = 1500,
  onDismiss,
  message,
  wrapperStyle,
  style,
  type = "default",
  defaultIcon = true,
}: Props) {
  const renderIcon = () => {
    if (!defaultIcon || type === "default") {
      return <></>;
    }
    if (type === "error") {
      return <MaterialIcons name="error-outline" size={20} color="#EB212E" />;
    } else if (type === "warning") {
      return <MaterialIcons name="error-outline" size={20} color="yellow" />;
    } else if (type === "success") {
      return <AntDesign name="checkcircleo" size={20} color="#32CD32" />;
    }
    return <></>;
  };

  const color = "white";
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    snackbar: {
      borderRadius: 8,
      opacity: 0.75,
      alignContent: "center",
      justifyContent: "space-between",
      flexDirection: "row",
    },
    text: {
      color: color,
      marginLeft: 12,
    },
  });

  return (
    <Snackbar
      visible={visible}
      action={action}
      duration={duration}
      onDismiss={onDismiss}
      wrapperStyle={[wrapperStyle]}
      style={[styles.snackbar, style]}
    >
      <View style={styles.container}>
        {renderIcon()}
        <Text style={styles.text}>{message}</Text>
      </View>
    </Snackbar>
  );
}
