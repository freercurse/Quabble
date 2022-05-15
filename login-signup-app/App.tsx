import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { getDatabase } from "firebase/database";
import { initializeApp } from 'firebase/app';
import { Bytes, getFirestore } from "firebase/firestore";
import { LogBox } from 'react-native';


import { useState } from 'react';

const firebaseConfig = {
  apiKey: "AIzaSyCtaianGPpG03qcyE3YPY5oay3SvXkq8P4",
  authDomain: "quabble-7fced.firebaseapp.com",
  projectId: "quabble-7fced",
  storageBucket: "quabble-7fced.appspot.com",
  messagingSenderId: "86011789417",
  appId: "1:86011789417:web:a4d14934164165fb5922f8",
  measurementId: "G-BL9KXEWCBV",
  databaseURL: 'https://quabble-7fced-default-rtdb.europe-west1.firebasedatabase.app/'

};


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const data = getFirestore(app);

import {getAuth, onAuthStateChanged, User,  } from 'firebase/auth';
import React from 'react';

export default function App() {
  LogBox.ignoreLogs(['Require cycle:', 'AsyncStorage ']);
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();  
  
  const [user, setUser] = useState<User | undefined>();
  const auth = getAuth(); 

  if (app) {
    onAuthStateChanged(auth, (user) => {
      if (user != null) {
        setUser(user)        
      }
      
    });
  }
  
   
  
  if (!isLoadingComplete || !app) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} auth={auth} user={user} data={data} database={database} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}


