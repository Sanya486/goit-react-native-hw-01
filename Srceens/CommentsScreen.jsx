import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableOpacity,
  FlatList,
  Keyboard,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { addComment } from "../redux/firebaseApi";
import { selectUid } from "../redux/selectors";
import { query, collection, onSnapshot } from "firebase/firestore";
import { db } from "../config";


const CommentsScreen = ({ route }) => {
  const [input, setInput] = useState();
  const [comments, setComments] = useState([]);

  console.log(comments)

  const uid = useSelector(selectUid)

  const dispatch = useDispatch();
  const { photo, id } = route.params;
  
   

  useEffect(() => {
 
    const q = query(collection(db, `users/${uid}/posts/${id}/comments`));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
       let commentsFirebase = [];
      querySnapshot.forEach((doc) => {
        commentsFirebase.push({
          comment: doc.data().input,
          timeNow: doc.data().timeNow,
        });
      });
      commentsFirebase.sort((a, b) => b.timeNow - a.timeNow)
      setComments(commentsFirebase);
    });
    return () => {
      unsubscribe()
    }
  },[])

  const handleAddComment = () => {
    const timeNow = Date.now()
    dispatch(addComment({ input, id, uid, timeNow }));
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <View style={styles.container}>
          <Image
            style={{ height: 240, width: "100%", borderRadius: 10 }}
            source={{ uri: photo }}
          />
          {comments.length !== 0 && (
            <FlatList
              data={comments}
              renderItem={({ item }) => {
                
                return (
                  <View style={{height: 103, borderRadius: 6, backgroundColor: 'rgba(0, 0, 0, 0.03)', marginBottom: 24, padding:16}}>
                    <Text style={{fontSize: 13, lineHeight: 18, color: '#212121'}}>{item.comment}</Text>
                  </View>
                );
              }}
              keyExtractor={(comment) => comment.timeNow}
            />
          )}
          <KeyboardAvoidingView behavior="padding">
            <TextInput
              style={styles.input}
              placeholder="Коментувати..."
              onChangeText={(text) => setInput(text)}
              value={input}
            />
            <TouchableOpacity
              style={styles.iconWrapper}
              onPress={() => {
                handleAddComment()
                setInput('')
                Keyboard.dismiss()
              }}
            >
              <AntDesign name="arrowup" size={20} color="white" />
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 24,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 32,
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
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    right: 8,
    top: 8,
    width: 34,
    height: 34,
    backgroundColor: "#FF6C00",
    borderRadius: "50%",
  },
});

export default CommentsScreen;
