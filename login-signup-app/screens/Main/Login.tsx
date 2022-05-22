import React, { useContext, useEffect, useLayoutEffect } from 'react';
import { Button, LogBox, StyleSheet, TextInput } from 'react-native';
import {signInWithEmailAndPassword,Auth, UserCredential, User } from 'firebase/auth';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { AuthContext, UserContext } from '../navigation';
import * as SecureStore from 'expo-secure-store';

export default function Login({ navigation, }: RootTabScreenProps<'Login'>) {
  LogBox.ignoreLogs(['Require cycle:', 'AsyncStorage ']);
  
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  
  const Ucontext: User = React.useContext(UserContext);
  const Acontext: Auth = React.useContext(AuthContext);

  useEffect(() => {
    if (Ucontext) {      
      navigation.navigate('Dashboard');
    }
  },[Ucontext])
  
  
 
  
  const handleLogin = async () => {    
      await signInWithEmailAndPassword(Acontext,username, password)
        .then((userCredential) => {                
        handleVerification(userCredential)
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          alert('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          alert('That email address is invalid!');
        }

        console.error(error);
      });
  }

  const handleVerification = (user : UserCredential) => {    
    
    if (user.user.emailVerified) {
      setUsername('');
      setPassword('');     
     
      navigation.navigate('Dashboard');
    } else {
      alert('Email not verified! \nPlease verify before logging in')        
    }    
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quabble</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text style={styles.title}>Email Address</Text>
      <TextInput defaultValue={username} onChangeText={(email) => setUsername(email.trim())} style={styles.input} />
      <Text style={styles.title}>Password</Text>
      <TextInput defaultValue={password} onChangeText={(password) => setPassword(password)} secureTextEntry={true} style={styles.input} />
      <Button onPress={() => handleLogin()}  title="Login" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',

  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  input: {
    width: '60%',
    color: 'white',
    borderColor: 'white',
    borderStyle: 'solid',
    borderWidth: 3,
    height: 45,
    padding: 13,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
 
});
