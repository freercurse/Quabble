import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'dotenv/config'
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { getDatabase } from "firebase/database";
import { initializeApp } from 'firebase/app';
import { Bytes, getFirestore } from "firebase/firestore";
import { LogBox, StyleSheet } from 'react-native';
require('dotenv').config()

import { useState } from 'react';


const firebaseConfig = {
  apiKey: process.env.API,
  authDomain: process.env.AUTH,
  projectId: process.env.PROJECT,
  storageBucket: process.env.STORAGE,
  messagingSenderId: process.env.MESSAGE,
  appId: process.env.APP,
  measurementId: process.env.MESUREMENT,
  databaseURL: process.env.DATABASE
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const data = getFirestore(app);

import {getAuth, onAuthStateChanged, User,  } from 'firebase/auth';
import React from 'react';

export default function App() {
  LogBox.ignoreLogs(['Require cycle:', 'AsyncStorage ', 'Event']);
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