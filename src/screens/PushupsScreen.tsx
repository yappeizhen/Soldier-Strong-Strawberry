import { Camera } from "expo-camera";
import { StyleSheet } from "react-native";

import CustomButton from "../components/CustomButton";
import { View } from "../components/Themed";
import { LoadingView } from "./ComputerVision/LoadingView";
import { ModelView } from "./ComputerVision/ModelView";

export default function PushupsScreen() {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  if (!permission?.granted) {
    return (
      <LoadingView message="Camera permission is required to continue">
        <CustomButton onPress={requestPermission}>
          Grant Permission
        </CustomButton>
      </LoadingView>
    );
  }
  return (
    <View style={styles.container}>
      <ModelView />
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
    height: "100%",
    width: "100%",
  },
  camera: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
});
