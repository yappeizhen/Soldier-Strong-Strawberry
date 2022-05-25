import * as React from "react";
import { ComponentType } from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { HomeStackParamList } from "../../types";
import ModalScreen from "../screens/ModalScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import { toggles } from "../toggles";
import BottomTabShifting from "./BottomTabShifting";
import BottomTabSwipeable from "./BottomTabSwipeable";

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<HomeStackParamList>();
const renderTabNavigatorType = () => {
  if (toggles.homeTabLayout === "shifting") {
    return BottomTabShifting;
  } else {
    return BottomTabSwipeable;
  }
};

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={renderTabNavigatorType()}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
      <Stack.Group
        screenOptions={{
          presentation: "modal",
          gestureEnabled: true,
          animation: "slide_from_bottom",
        }}
      >
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}
