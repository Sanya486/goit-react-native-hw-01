import React from 'react'
import { View, Text, Image, TextInput, StyleSheet, SafeAreaView } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const CommentsScreen = ({ route }) => {
  const data= route.params
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Image
          style={{ height: 240, width: "100%", borderRadius: 10 }}
          source={{ uri: data.photo }}
        />
        <View>
          <TextInput style={styles.input} placeholder="Коментувати..." />
          <View style={styles.iconWrapper}>
            <AntDesign name="arrowup" size={20} color="white" />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 32,
    gap: 32,
    justifyContent: "space-between",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 100,
    padding: 16,
  },
  iconWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    right: 8,
    top: 8,
    width: 34,
    height: 34,
    backgroundColor: "#FF6C00",
    borderRadius: "50%",
  },
});

export default CommentsScreen
