import React, { useContext } from 'react';
import { Button, StyleSheet, TextInput } from 'react-native';
import { createUserWithEmailAndPassword, Auth, UserCredential, sendEmailVerification,  } from 'firebase/auth';
import { AuthContext } from '../../navigation/index';
import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View } from '../../components/Themed';

export default function Register() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const Acontext: Auth = useContext(AuthContext)


  const handleRegister = async () => {
    await createUserWithEmailAndPassword(Acontext, username, password)
      .then((userCredential) => {
        alert('User account created \nplease verify your email to use the app')
        setUsername('');
        setPassword('');
        sendEmailVerification(userCredential.user)
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          alert('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          alert('That email address is invalid!');
        }

        alert(error);
      });
  }

  const handleVerification = () => {

    if (Acontext.currentUser && !Acontext.currentUser.emailVerified) {
      sendEmailVerification(Acontext.currentUser)
        .then(() => {
          alert('Verification email sent')
        })
        .catch(error => {
          alert(error)
        })
    } else if (Acontext.currentUser && Acontext.currentUser.emailVerified) {
      alert('Email already verified')
    }
    else {
      alert('Please attempt to login first')
    }


  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Email Address</Text>
      <TextInput defaultValue={username} onChangeText={(email) => setUsername(email.trim())} style={styles.input} />
      <Text style={styles.title}>Password</Text>
      <TextInput defaultValue={password} onChangeText={(password) => setPassword(password.trim())} secureTextEntry={true} style={styles.input} />
      <Button onPress={() => handleRegister()} title="Register" />
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Button onPress={() => handleVerification()} title="Resend Verification" />
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
    marginVertical: 50,
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
