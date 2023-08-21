import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import {
  selectDisplayName,
  selectEmail,
  selectIsLoggedIn,
  selectPostImages,
  selectPostsData,
  selectUid,
  selectUserData,
} from "../redux/selectors";
import { getAllposts, getAllpostsImages } from "../redux/firebaseApi";
import { auth, db } from "../config";
import { onSnapshot, query, collection } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addPostsToRedux } from "../redux/postSlice";


const PostsScreen = ({ route, navigation }) => {
  const tabBarHeight = useBottomTabBarHeight();

  const [isMapOpen, setIsMapOpen] = useState(false);
  const [marker, setMarker] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const dispatch = useDispatch();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const uid = useSelector(selectUid);
  const displayName = useSelector(selectDisplayName)
  const email = useSelector(selectEmail)
  const postsData = useSelector(selectPostsData);
  const postImages = useSelector(selectPostImages);

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

  useEffect(() => {
    if (!isLoggedIn) {
      navigation.navigate("Login");
    }
  }, [isLoggedIn]);

  const OnLocation = (location, name) => {
    setIsMapOpen(true);
    setMarker({ location, name });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
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

      <View style={[styles.container, { marginBottom: tabBarHeight + 10 }]}>
        <View style={styles.userTextWrapper}>
          <Image source={require("../images/User.png")} />
          <View>
            <Text style={styles.userName}>{displayName}</Text>
            <Text style={{ fontSize: 11, color: "#212121CC" }}>
              {email}
            </Text>
          </View>
        </View>
        <View>
          {postsData.length !== 0 && (
            <FlatList
              refreshing={isRefreshing}
              onRefresh={() => {
                setIsRefreshing(true);
                dispatch(getAllposts(uid));
                dispatch(getAllpostsImages(uid));
                setIsRefreshing(false);
              }}
              data={postsData}
              renderItem={({ item: { data, id } }) => {
                let locationText;

                if (!data?.locationInput && !data?.location) {
                  locationText = (
                    <Text style={{ fontSize: 16 }}>Локація відсутня</Text>
                  );
                } else if (data?.location && !data?.locationInput) {
                  locationText = <Text style={{ fontSize: 16 }}>Локація</Text>;
                } else {
                  locationText = (
                    <Text style={{ fontSize: 16 }}>{data?.locationInput}</Text>
                  );
                }

                return (
                  <View style={{ gap: 8, paddingBottom: 32 }}>
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
                        {locationText}
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }}
              keyExtractor={(post) => post.id}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 32,
    gap: 32,
  },
  userTextWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  userName: {
    fontFamily: "Roboto-Bold",
    fontSize: 13,
    lineHeight: 15.23,
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

export default PostsScreen;
