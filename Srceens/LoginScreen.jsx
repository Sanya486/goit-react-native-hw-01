import React, {useEffect} from "react";
import {
  StyleSheet,
  ImageBackground,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { selectIsLoggedIn } from "../redux/selectors";
import { loginDB } from "../redux/firebaseApi";



const LoginScreen = () => {
      const navigation = useNavigation();
      const dispatch = useDispatch()
      const isLoggedIn = useSelector(selectIsLoggedIn)
      useEffect(()=> {
        if(isLoggedIn){
          
          navigation.navigate("Home");
        }
      },[isLoggedIn])

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground
        source={require("../images/bcgPhoto.png")}
        resizeMode="stretch"
        style={styles.bcgImage}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flexGrow: 0.48 }}
        >
          <View style={styles.contentWrapper}>
            <Text style={styles.title}>Увійти</Text>
            <Formik
              initialValues={{ email: "", pasfsword: "" }}
              onSubmit={(values) => {
                dispatch(loginDB(values))
              }}
              validationSchema={Yup.object({
                email: Yup.string()
                  .email("Invalid email address")
                  .required("Required"),
                password: Yup.string().required("Required"),
              })}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View style={{ gap: 16, marginTop: 32 }}>
                  <TextInput
                    placeholder="Адреса електронної пошти"
                    style={styles.input}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                  />
                  {errors.email && touched.email && (
                    <Text
                      style={{
                        color: "red",
                        paddingLeft: 16,
                        paddingRight: 16,
                      }}
                    >
                      {errors.email}
                    </Text>
                  )}
                  <TextInput
                    textContentType="password"
                    secureTextEntry
                    placeholder="Пароль"
                    style={styles.input}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                  />
                  <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
                    <Text style={styles.btnText}>Увійти</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
            <TouchableWithoutFeedback
              onPress={() => navigation.navigate("Registration")}
            >
              <Text style={styles.accExistText}>
                Немає акаунту? Зареєструватися
              </Text>
            </TouchableWithoutFeedback>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  bcgImage: {
    height: "100%",
    width: "100%",
    justifyContent: "flex-end",
  },
  contentWrapper: {
    flex: 1,
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
