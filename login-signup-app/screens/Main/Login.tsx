import React, { useContext, useEffect, useLayoutEffect } from 'react';
import { Button, LogBox, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { signInWithEmailAndPassword, Auth, UserCredential, User } from 'firebase/auth';
import { Text, View } from '../../components/Themed';
import { RootTabScreenProps } from '../../types';
import { AuthContext, UserContext } from '../../navigation';

export default function Login({ navigation, }: RootTabScreenProps<'Login'>) {
  LogBox.ignoreLogs(['Require cycle:', 'AsyncStorage ']);

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const Ucontext: User = React.useContext(UserContext);
  const Acontext: Auth = React.useContext(AuthContext);

  useEffect(() => {
    if (Ucontext && Ucontext.emailVerified) {
      navigation.navigate('Dashboard');
    }else if(Ucontext){
      alert("please verify your email address")
    }
  }, [Ucontext])

  const handleLogin = async () => {
    await signInWithEmailAndPassword(Acontext, username, password)
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
        
      });
  }

  const handleVerification = (user: UserCredential) => {

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
      <TextInput placeholder='Email Address' placeholderTextColor="white" defaultValue={username} onChangeText={(email) => setUsername(email.trim())} style={styles.input} />
      <TouchableOpacity>
        <Text style={{ marginLeft: 150, fontFamily: 'monospace' }}>Forgot Email?</Text>

      </TouchableOpacity>

      <TextInput placeholder="Password" placeholderTextColor="white" defaultValue={password} onChangeText={(password) => setPassword(password)} secureTextEntry={true} style={styles.input} />

      <TouchableOpacity>
        <Text style={styles.textStyle}>Forgot Password?</Text>
      </TouchableOpacity>


      <TouchableOpacity style={styles.button} onPress={() => handleLogin()}>
        <Text style={{ fontFamily: 'monospace' }}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={{ marginTop: 20, fontFamily: 'monospace' }}> Not registered?</Text>
      </TouchableOpacity>
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
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'monospace',

  },

  textStyle: {
    marginLeft: 150,
    marginBottom: 20,
    fontFamily: 'monospace',
  },

  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },

  button: {
    backgroundColor: '#CF9FFF',
    padding: 20,
    borderRadius: 25,
  },

  input: {

    fontFamily: 'monospace',
    width: '60%',
    color: 'white',
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 2,
    height: 45,
    padding: 13,
    textAlign: 'left',
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 25,
    backgroundColor: '#CF9FFF',
  },



});
