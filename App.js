import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import RegistrationScreen from './Srceens/RegistrationScreen';
import {useFonts} from 'expo-font'

export default function App() {
  const [fontsLoaded] = useFonts({
    'Roboto-Regular': require('./fonts/Roboto-Regular.ttf'),
    'Roboto-Medium': require('./fonts/Roboto-Medium.ttf'),
    'Roboto-Bold': require('./fonts/Roboto-Bold.ttf')
  })
  return (
    // <View style={styles.container}>
    //   <Text style={styles.text}>Hello my first React Native App!</Text>
    //   <StatusBar style="auto" />
    // </View>
    <RegistrationScreen></RegistrationScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 50,
    color: 'red',
  }
});
