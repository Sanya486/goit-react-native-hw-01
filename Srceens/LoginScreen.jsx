import React from "react";
import {
  StyleSheet,
  ImageBackground,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

const LoginScreen = () => {
  return (
    <ImageBackground
      source={require("../images/bcgPhoto.png")}
      resizeMode="stretch"
      style={styles.bcgImage}
    >
      <KeyboardAvoidingView behavior="padding" style={{flexGrow: 0.48}}>
        <View style={styles.contentWrapper}>
          <Text style={styles.title}>Увійти</Text>
          <View style={{ display: "flex", gap: 16, marginTop: 32 }}>
            <TextInput
              placeholder="Адреса електронної пошти"
              style={styles.input}
            />
            <TextInput
              textContentType="password"
              secureTextEntry
              placeholder="Пароль"
              style={styles.input}
            />
          </View>
          <TouchableOpacity style={styles.btn}>
            <Text style={styles.btnText}>Увійти</Text>
          </TouchableOpacity>
          <TouchableWithoutFeedback>
            <Text style={styles.accExistText}>
              {" "}
              Немає акаунту? Зареєструватися
            </Text>
          </TouchableWithoutFeedback>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bcgImage: {
    height: "100%",
    width: "100%",
        justifyContent: "flex-end",
  },
    contentWrapper: {
      flex:1,
    paddingLeft: 16,
      paddingRight: 16,
    backgroundColor: "white",
    borderStartStartRadius: 25,
    borderTopEndRadius: 25,
  },
  title: {
    fontFamily: "Roboto-Medium",
    fontSize: 30,
    lineHeight: 33.16,
    textAlign: "center",
    paddingTop: 32,
  },
  input: {
    padding: 16,
    borderColor: "#E8E8E8",
      backgroundColor: "#f6f6f6",
    borderRadius: 10,
    color: "#1B4371",
    height: 50,
    borderWidth: 1,
    width: "100%",
  },
  btn: {
    width: "100%",
    height: 51,
    backgroundColor: "#ff6c00",
    borderRadius: 100,
    marginTop: 43,

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
  accExistText: {
    marginTop: 16,
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 18.75,
    textAlign: "center",
    color: "#1B4371",
  },
});

export default LoginScreen;
