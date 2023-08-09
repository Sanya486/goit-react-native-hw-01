import { StyleSheet } from 'react-native';
import RegistrationScreen from './Srceens/RegistrationScreen';
import {useFonts} from 'expo-font'
import LoginScreen from './Srceens/LoginScreen';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Roboto-Regular': require('./fonts/Roboto-Regular.ttf'),
    'Roboto-Medium': require('./fonts/Roboto-Medium.ttf'),
    'Roboto-Bold': require('./fonts/Roboto-Bold.ttf')
  })
   if (!fontsLoaded) {
     return null;
   }
  return (
    <RegistrationScreen></RegistrationScreen>
    // <LoginScreen></LoginScreen>
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
