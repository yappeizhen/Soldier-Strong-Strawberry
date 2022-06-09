import { StatusBar } from "expo-status-bar";
import { Provider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";

import useCachedResources from "./src/hooks/useCachedResources";
import useColorScheme from "./src/hooks/useColorScheme";
import LinkingConfiguration from "./src/navigation/LinkingConfiguration";
import RootDrawerNavigator from "./src/navigation/RootDrawerNavigator";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Provider>
          <NavigationContainer
            linking={LinkingConfiguration}
            theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <RootDrawerNavigator />
          </NavigationContainer>
          <StatusBar />
        </Provider>
      </SafeAreaProvider>
    );
  }
}
