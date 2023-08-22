import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import RegistrationScreen from "./Srceens/RegistrationScreen";
import { useFonts } from "expo-font";
import LoginScreen from "./Srceens/LoginScreen";
import Home from "./Srceens/Home";
import CommentsScreen from "./Srceens/CommentsScreen";
import Toast from "react-native-toast-message";

import {store, persistor} from "./redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export default function App() {
  const [fontsLoaded] = useFonts({
    "Roboto-Regular": require("./fonts/Roboto-Regular.ttf"),
    "Roboto-Medium": require("./fonts/Roboto-Medium.ttf"),
    "Roboto-Bold": require("./fonts/Roboto-Bold.ttf"),
  });
  if (!fontsLoaded) {
    return null;
  }

  const MainStack = createStackNavigator();
  return (
    <>
      <Provider store={store}> 
        <PersistGate persistor={persistor}>
          <NavigationContainer>
            <MainStack.Navigator initialRouteName="Login">
              <MainStack.Screen
                name="Registration"
                component={RegistrationScreen}
                options={{ headerShown: false }}
              />
              <MainStack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <MainStack.Screen
                name="Home"
                component={Home}
                options={{ headerShown: false, gestureEnabled: false}}
              />
              <MainStack.Screen
                name="Comments"
                component={CommentsScreen}
                options={{ title: "Коментарі" }}
              />
            </MainStack.Navigator>
          </NavigationContainer>
          <Toast />
        </PersistGate>
      </Provider>
    </>
  );r
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "bold",
    fontSize: 50,
    color: "red",
  },
});
