import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Button,
  SafeAreaView,
} from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";

const PostsScreen = ({ route, navigation }) => {
  const tabBarHeight = useBottomTabBarHeight();
  const [posts, setPosts] = useState([]);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [marker, setMarker] = useState(null);
  let postData = route.params;
  console.log(postData);
  useEffect(() => {
    if (postData !== undefined) {
      setPosts([...posts, postData]);
      postData = undefined;
    }
  }, [postData]);

  const OnLocation = (location, name) => {
    console.log("MArker location", location);
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
            <Text style={styles.userName}>Natali Romanova</Text>
            <Text style={{ fontSize: 11, color: "#212121CC" }}>
              email@example.com
            </Text>
          </View>
        </View>
        <View>
          {posts.length !== 0 && (
            <FlatList
              data={posts}
              renderItem={({ item }) => {
                let locationText;

                if (!item.locationInput && !item.location) {
                  locationText = (
                    <Text style={{ fontSize: 16 }}>Локація відсутня</Text>
                  );
                } else if (item.location && !item.locationInput) {
                  locationText = <Text style={{ fontSize: 16 }}>Локація</Text>;
                } else {
                  locationText = (
                    <Text style={{ fontSize: 16 }}>{item.locationInput}</Text>
                  );
                }
                return (
                  <View style={{ gap: 8, paddingBottom: 32 }}>
                    <Image
                      style={{ height: 240, width: "100%", borderRadius: 10 }}
                      source={{ uri: item.photo }}
                    />
                    <Text style={{ fontFamily: "Roboto-Medium", fontSize: 16 }}>
                      {item.nameInput}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <TouchableOpacity
                        style={{ flexDirection: "row" }}
                        onPress={() => navigation.navigate("Comments", item)}
                      >
                        <EvilIcons name="comment" size={24} color="black" />
                        <Text style={{ fontSize: 16 }}>0</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{ flexDirection: "row" }}
                        onPress={() =>
                          OnLocation(item.location, item.nameInput)
                        }
                      >
                        <EvilIcons name="location" size={24} color="black" />
                        {locationText}
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }}
              keyExtractor={(post) => post.nameInput}
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
