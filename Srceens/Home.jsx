import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import PostsScreen from './PostsScreen';
import CreatePostsScreen from './CreatePostsScreen';
import ProfileScreen from './ProfileScreen';
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { logOut } from "../redux/firebaseApi";

const Home = () => {
    const Tab = createBottomTabNavigator()
    const dispatch = useDispatch()
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === "Публікації") {
              iconName = "appstore-o";
            } else if (route.name === "Створити публікацію") {
              iconName = "plus";
            } else if (route.name === "ProfileScreen") {
              iconName = "user";
            }
            return <AntDesign name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "grey",
          tabBarActiveBackgroundColor: "#FF6C00",
          tabBarItemStyle: {
            borderRadius: 20,
            maxWidth: 70,
            height: 40,
            alignSelf: "center",
          },
          tabBarStyle: { height: 83, alignItems: "center", display: 'flex' },
          tabBarShowLabel: false,
        })}
      >
        <Tab.Screen
          name="Публікації"
          component={PostsScreen}
          options={{
            headerRight: () => (
             <TouchableOpacity onPress={()=> dispatch(logOut())}>
               <Ionicons name="exit-outline" size={24} color="black" />
               </TouchableOpacity>
            ),
            headerRightContainerStyle: { paddingRight: 16 },
          }}
        />
        <Tab.Screen name="Створити публікацію" component={CreatePostsScreen} />
        <Tab.Screen name="ProfileScreen" component={ProfileScreen} />
      </Tab.Navigator>
    );
}

export default Home
