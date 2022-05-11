import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {Button,Platform, Pressable, StyleSheet, TextInput, Image, LogBox } from 'react-native';
import { AuthContext, DataContext, UserContext } from '../navigation/index';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { Auth, updateProfile, User } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';

import { ConfirmDialog,ProgressDialog } from 'react-native-simple-dialogs';
import {launchImageLibraryAsync, MediaTypeOptions, requestMediaLibraryPermissionsAsync, ImagePickerResult} from 'expo-image-picker';
import { ref, getStorage, uploadBytesResumable, getDownloadURL } from 'firebase/storage';


export default function Home({ navigation, }: RootTabScreenProps<'Chat'>) {
  const Acontext: Auth = React.useContext(AuthContext);
  const Ucontext: User = React.useContext(UserContext);
  const Dcontext: Firestore = React.useContext(DataContext);
  
  const [name, setUsername] = React.useState('')
  const [loading, setLoading] = React.useState(false);
  const [photo, setPhoto] = React.useState('');
  const [UNVis, setUNVis] = React.useState(false)
  LogBox.ignoreLogs([`Setting a timer for a long period`]);
  
  
  const onSetPhone = () => {
    alert('this user wants to change there Phone')
  }  

  const pickImage = async () => {
    let status = await requestMediaLibraryPermissionsAsync();
    if (!status.granted || status.accessPrivileges == "none") {
      alert('You need to enable permissions to use this feature');
      return
    }
    
    // No permissions request is necessary for launching the image library
    let result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    setLoading(true);
    handleImagePicked(result)
  }

  const handleImagePicked = async (pickerResult: ImagePickerResult) => {
    try {      

      if (!pickerResult.cancelled) {
        
        await uploadImageAsync(pickerResult.uri)   
        
      }else {
        setLoading(false);
      }
    } catch (e) {
     
      setLoading(false);
      alert(e);
      
    } 
    
  };  
    
  const uploadImageAsync = async (pickerResult: string ) => {
    
    const blob: Blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", pickerResult,true);
      xhr.send(null);
    });
    
    const storage = getStorage(Dcontext.app, 'gs://quabble-7fced.appspot.com/')

    const Avatar = ref(storage, 'avatar/' + Ucontext.uid + '.jpg')  
    
    const uploadTask = uploadBytesResumable(Avatar, blob)

    uploadTask.on('state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        setLoading(false);
        alert(error);
        console.log(error);
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          updateProfile(Ucontext, {
            photoURL: downloadURL,
          })
          setLoading(false);
          alert('image successfully loaded')
          
        });
      }
    );
    
    
    
  }
  
  return (
    <View style={styles.container}>
      <Pressable onPress={() => pickImage()}>
        {Ucontext.photoURL && <Image source={{ uri: Ucontext.photoURL }} style={{ width: 250, height: 188 }} /> || <Text style={styles.profile}> Profile image is not set, click to change.</Text>}
      </Pressable>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />      
      <Text style={styles.title}>Welcome to your Home page</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text style={styles.profile}>{Ucontext.email}</Text>      
      <Pressable onPress={() => setUNVis(true)}>
        <Text style={styles.profile}>{Ucontext.displayName ? Ucontext.displayName : 'Username is not set, click to change.'}</Text>
      </Pressable>      
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Button title="Sign Out" onPress={async ()  => { await Acontext.signOut(), alert("You have been logged out"), navigation.navigate('Root') }} />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      
      {/* Dialog boxes controlling profile changes */}
      {loading && <ProgressDialog
        visible={loading}
        title="Uploading image"
        message="Please, wait..."
        activityIndicatorColor={'black'}
      />}
      { UNVis &&<ConfirmDialog
        title="Enter your new Username."        
        visible={UNVis}
        onTouchOutside={() => setUNVis(false)}
        positiveButton={{
          title: "OK",
          onPress: () => {
            updateProfile(Ucontext, {
              displayName: name,
            }).then(() => {
              alert('Your nickname has been changed to ' + name)
            }).catch((error) => {
              alert(error);
            }), setUNVis(false), setUsername('')
          }
        }} >
        <View style={styles.Dcontainer}>
          <TextInput defaultValue={name} onChangeText={(name: string) => setUsername(name)} style={styles.input} />
        </View>
      </ConfirmDialog>}
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Dcontainer: {
    backgroundColor: '#fff',    
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {    
    width: '60%',
    color: 'black',
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 3,
    height: 45,
    padding: 13,
    textAlign: 'center',
    
    
  },
  profile: {
    fontSize: 15,
    marginVertical: 10,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});