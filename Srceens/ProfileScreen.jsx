import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  SafeAreaView,
} from "react-native";

import { EvilIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import {
  selectDisplayName,
  selectEmail,
  selectIsLoggedIn,
  selectPostImages,
  selectPostsData,
  selectUid,
  selectUserData,
  selectUserPhoto,
} from "../redux/selectors";
import {
  getAllposts,
  getAllpostsImages,
  getUserPhoto,
  logOut,
} from "../redux/firebaseApi";
import { auth, db } from "../config";
import { onSnapshot, query, collection } from "firebase/firestore";

import { addPostsToRedux } from "../redux/postSlice";
import { useSelector, useDispatch } from "react-redux";


const ProfileScreen = ({navigation}) => {
  const tabBarHeight = useBottomTabBarHeight();

  const [isMapOpen, setIsMapOpen] = useState(false);
  const [marker, setMarker] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const dispatch = useDispatch();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const uid = useSelector(selectUid);
  const displayName = useSelector(selectDisplayName);
  const email = useSelector(selectEmail);
  const postsData = useSelector(selectPostsData);
  const postImages = useSelector(selectPostImages);
  const userPhoto = useSelector(selectUserPhoto);

  useEffect(() => {
    if (!isLoggedIn) {
      navigation.navigate("Login");
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const q = query(collection(db, `users/${uid}/posts`));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let postsFirebase = [];
      querySnapshot.forEach((doc) => {
        postsFirebase.push({data:doc.data(), id: doc.id});
      });
      postsFirebase.sort((a, b) => b.data.timeNow - a.data.timeNow)
      dispatch(addPostsToRedux(postsFirebase))
    });

    return () => {unsubscribe()}
  }, []);

  useEffect(() => {
    setTimeout(() => dispatch(getAllpostsImages(uid)), 2000);
    dispatch(getAllpostsImages(uid));
  }, [postsData]);

  useEffect(()=> {
    dispatch(getUserPhoto(uid))
  }, [])

  function OnLocation(location, name) {
    setIsMapOpen(true);
    setMarker({ location, name });
  }
  return (
    <SafeAreaView>
      {isMapOpen && marker.location !== null && (
        <View style={styles.containerMap}>
          <MapView
            style={styles.mapStyle}
            region={{
              latitude: marker.location?.latitude,
              longitude: marker.location?.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            mapType="standard"
            provider={PROVIDER_GOOGLE}
          >
            <Marker
              title={marker.name}
              coordinate={{
                latitude: marker.location?.latitude,
                longitude: marker.location?.longitude,
              }}
            />
          </MapView>
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              backgroundColor: "white",
              padding: 10,
              borderRadius: 10,
            }}
            onPress={() => setIsMapOpen(false)}
          >
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      )}
      <ImageBackground
        source={require("../images/bcgPhoto.png")}
        resizeMode="stretch"
        style={styles.bcgImage}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View
            style={{
              marginTop: 150,
              paddingTop: 92,
              paddingLeft: 16,
              paddingRight: 16,
              flex: 1,
              backgroundColor: "white",
              alignItems: "center",
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
            }}
          >
            <Image
              style={{
                position: "absolute",
                top: -60,
                width: 120,
                height: 120,
                alignItems: "center",
                borderRadius: 16,
              }}
              source={{ uri: userPhoto }}
            />
            <TouchableOpacity style={{position:'absolute', top: 22, right: 22}} onPress={() => dispatch(logOut())}>
              <Ionicons name="exit-outline" size={24} color="black" />
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: "Roboto-Medium",
                marginBottom: 32,
                lineHeight: 35.16,
                fontWeight: 500,
                fontSize: 30,
              }}
            >
              {displayName}
            </Text>
            <View style={{ width: "100%" }}>
              {postsData.length !== 0 &&
                postsData.map(({ data, id }, index) => (
                  <View style={{ gap: 8, paddingBottom: 32 }} key={index}>
                    <Image
                      style={{ height: 240, width: "100%", borderRadius: 10 }}
                      source={{
                        uri:
                          postImages[id] ||
                          "https://joadre.com/wp-content/uploads/2019/02/no-image.jpg",
                      }}
                    />
                    <Text style={{ fontFamily: "Roboto-Medium", fontSize: 16 }}>
                      {data?.nameInput}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <TouchableOpacity
                        style={{ flexDirection: "row" }}
                        onPress={() =>
                          navigation.navigate("Comments", {
                            photo:
                              postImages[id] ||
                              "https://joadre.com/wp-content/uploads/2019/02/no-image.jpg",
                            id,
                          })
                        }
                      >
                        <EvilIcons name="comment" size={24} color="black" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{ flexDirection: "row" }}
                        onPress={() =>
                          OnLocation(data?.location, data?.nameInput)
                        }
                      >
                        <EvilIcons name="location" size={24} color="black" />
                        <Text> Локация</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  bcgImage: {
    height: "100%",
    width: "100%",
  },
  containerMap: {
    position: "absolute",
    zIndex: 100,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
export default ProfileScreen;
