import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { API, AUTH, PROJECT, STORAGE, MESSAGE, APP, MEASUREMENT, DATABASE} from '@env'
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { getDatabase } from "firebase/database";
import { initializeApp } from 'firebase/app';
import { Bytes, getFirestore } from "firebase/firestore";
import { LogBox, StyleSheet } from 'react-native';


import { useState } from 'react';


const firebaseConfig = {
  apiKey: API,
  authDomain: AUTH,
  projectId: PROJECT,
  storageBucket: STORAGE,
  messagingSenderId: MESSAGE,
  appId: APP,
  measurementId: MEASUREMENT,
  databaseURL: DATABASE
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const data = getFirestore(app);

import {getAuth, onAuthStateChanged, User,  } from 'firebase/auth';
import React from 'react';

export default function App() {
  LogBox.ignoreLogs(['Require', 'AsyncStorage ', 'Event', 'View']);
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