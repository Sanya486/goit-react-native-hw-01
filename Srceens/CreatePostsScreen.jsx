import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ImageBackground,
} from "react-native";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { MaterialIcons, EvilIcons } from "@expo/vector-icons";

const CreatePostsScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [nameInput, setNameInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      await MediaLibrary.requestPermissionsAsync();
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      await Location.requestForegroundPermissionsAsync();
      
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera or location</Text>;
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result)
      setPhoto(result.assets[0].uri);
      const data = await MediaLibrary.getAssetInfoAsync(
        result.assets[0].assetId);
      setLocation(data.location)
    }
  };

  const handlesubmit = async () => {
    try {
      const postData = { nameInput, locationInput, photo, location };
      setPhoto(null),
        setLocation(null),
        setNameInput(''),
        setLocationInput(''),
      navigation.jumpTo("Публікації", postData);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <>
      {isCameraOpen ? (
        <View style={styles.cameraContainer}>
          <Camera style={styles.camera} type={type} ref={setCameraRef}>
            <View style={styles.photoView}>
              <TouchableOpacity
                style={styles.flipContainer}
                onPress={() => {
                  setType(
                    type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  );
                }}
              >
                <Text
                  style={{ fontSize: 18, marginBottom: 10, color: "white" }}
                >
                  Flip
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={async () => {
                  if (cameraRef) {
                    const { uri } = await cameraRef.takePictureAsync();
                    const asset = await MediaLibrary.createAssetAsync(uri);
                    Location.getCurrentPositionAsync({}).then((result) => {
                        setLocation(result.coords);
                    });
                    setPhoto(uri);
                    setIsCameraOpen(false);
                  }
                }}
              >
                <View style={styles.takePhotoOut}>
                  <View style={styles.takePhotoInner}></View>
                </View>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      ) : (
        <View style={styles.container}>
          {photo ? (
            <ImageBackground source={{ uri: photo }} resizeMode="cover">
              <TouchableOpacity
                style={[styles.pictureBackdrop, { backgroundColor: "none" }]}
                onPress={() => setIsCameraOpen(true)}
              >
                <View
                  style={[
                    styles.photoIconWrapper,
                    { backgroundColor: "rgba(240, 240, 240, 0.3)" },
                  ]}
                >
                  <MaterialIcons
                    style={styles.photoIcon}
                    name="photo-camera"
                    size={24}
                    color="white"
                  />
                </View>
              </TouchableOpacity>
            </ImageBackground>
          ) : (
            <TouchableOpacity
              style={styles.pictureBackdrop}
              onPress={() => setIsCameraOpen(true)}
            >
              <View style={styles.photoIconWrapper}>
                <MaterialIcons
                  style={styles.photoIcon}
                  name="photo-camera"
                  size={24}
                  color="grey"
                />
              </View>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={{ marginTop: 8 }} onPress={pickImage}>
            <Text style={styles.photoAction}>Завантажити фото з Галереї</Text>
          </TouchableOpacity>
          <View style={{ gap: 16 }}>
            <TextInput
              style={styles.input}
              clearButtonMode="while-editing"
              placeholder="Назва..."
                onChangeText={(text) => setNameInput(text)}
                value={nameInput}
            />
            <View>
              <TextInput
                style={styles.input}
                clearButtonMode="while-editing"
                placeholder="Місцевість..."
                  onChangeText={(text) => setLocationInput(text)}
                  value={locationInput}
              />
              <EvilIcons
                style={{ position: "absolute", bottom: 20, left: 0 }}
                name="location"
                size={24}
                color="black"
              />
            </View>
            <TouchableOpacity style={styles.btn} onPress={handlesubmit}>
              <Text style={styles.btnText}>Опублікувати</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: { paddingLeft: 16, paddingRight: 16, paddingTop: 32 },
  cameraContainer: { flex: 1 },
  camera: { flex: 1 },
  photoView: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
  },

  flipContainer: {
    flex: 0.1,
    alignSelf: "flex-end",
  },

  button: { alignSelf: "center" },

  takePhotoOut: {
    borderWidth: 2,
    borderColor: "white",
    height: 50,
    width: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },

  takePhotoInner: {
    borderWidth: 2,
    borderColor: "white",
    height: 40,
    width: 40,
    backgroundColor: "white",
    borderRadius: 50,
  },
  pictureBackdrop: {
    borderRadius: 8,
    height: 240,
    backgroundColor: "#E8E8E8",
    alignItems: "center",
    justifyContent: "center",
  },
  photoIconWrapper: {
    height: 60,
    width: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: "50%",
  },
  photoAction: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 18.75,
    color: "#BDBDBD",
  },
  input: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 18.75,
    paddingLeft: 30,
    paddingVertical: 15,
    paddingRight: 15,
    borderBottomWidth: 1,
    borderColor: "#E8E8E8",
    height: 50,
  },
  btn: {
    width: "100%",
    height: 51,
    backgroundColor: "#ff6c00",
    borderRadius: 100,
    marginTop: 27,

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    fontFamily: "Roboto-Regular",
    color: "white",
    fontSize: 16,
    lineHeight: 18.75,
  },
});

export default CreatePostsScreen;
