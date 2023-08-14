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
      <NavigationContainer>
        <MainStack.Navigator initialRouteName="Home">
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
            options={{ headerShown: false }}
          />
          <MainStack.Screen
            name="Comments"
            component={CommentsScreen}
            options={{title: 'Коментарі' }}
          />
  
        </MainStack.Navigator>
      </NavigationContainer>
      <Toast/>
    </>
  );
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
