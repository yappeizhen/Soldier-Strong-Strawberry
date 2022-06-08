import * as React from "react";

import {
  AntDesign,
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

import { RootTabParamList } from "../../types";
import IpptCalculatorScreen from "../screens/IpptCalculatorScreen";
import MyStatsScreen from "../screens/MyStatsScreen";
import RunsScreen from "../screens/RunsScreen";
import StaticsScreen from "../screens/StaticsScreen";
import StaticsStackNavigator from "./StaticsStackNavigator";

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createMaterialBottomTabNavigator<RootTabParamList>();

export default function BottomTabShifting() {
  return (
    <BottomTab.Navigator initialRouteName="MyStats" shifting={true}>
      <BottomTab.Screen
        name="MyStats"
        component={MyStatsScreen}
        options={{
          title: "My Stats",
          tabBarIcon: ({ color }) => (
            <AntDesign
              name="dashboard"
              color={color}
              size={20}
              style={{ marginBottom: -3 }}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="Runs"
        component={RunsScreen}
        options={{
          title: "Runs",
          tabBarIcon: ({ color }) => (
            <MaterialIcons
              name="directions-run"
              color={color}
              size={20}
              style={{ marginBottom: -3 }}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="StaticsStack"
        component={StaticsStackNavigator}
        options={{
          title: "Statics",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="arm-flex"
              color={color}
              size={20}
              style={{ marginBottom: -3 }}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="Calculator"
        component={IpptCalculatorScreen}
        options={{
          title: "IPPT Calculator",
          tabBarIcon: ({ color }) => (
            <AntDesign
              name="calculator"
              color={color}
              size={20}
              style={{ marginBottom: -3 }}
            />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
