import * as React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { StaticsStackParamList } from "../../types";
import PushupsScreen from "../screens/PushupsScreen";
import SitupsScreen from "../screens/SitupsScreen";
import StaticsScreen from "../screens/StaticsScreen";

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<StaticsStackParamList>();

export default function StaticsStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ presentation: "card", animation: "slide_from_right" }}
    >
      <Stack.Screen
        name="Statics"
        component={StaticsScreen}
        options={{ title: "Statics", headerShown: false }}
      />
      <Stack.Screen
        name="Pushups"
        component={PushupsScreen}
        options={{ title: "Push Ups", headerTransparent: true }}
      />
      <Stack.Screen
        name="Situps"
        component={PushupsScreen}
        options={{ title: "Sit Ups", headerTransparent: true }}
      />
    </Stack.Navigator>
  );
}
