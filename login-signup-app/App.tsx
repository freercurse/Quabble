import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { LogBox } from 'react-native';


import { useState } from 'react';

const firebaseConfig = {
  apiKey: "AIzaSyCtaianGPpG03qcyE3YPY5oay3SvXkq8P4",
  authDomain: "quabble-7fced.firebaseapp.com",
  projectId: "quabble-7fced",
  storageBucket: "quabble-7fced.appspot.com",
  messagingSenderId: "86011789417",
  appId: "1:86011789417:web:a4d14934164165fb5922f8",
  measurementId: "G-BL9KXEWCBV"
};
const app = initializeApp(firebaseConfig);
const data = getFirestore(app);

import { Auth, browserLocalPersistence, getAuth, inMemoryPersistence, onAuthStateChanged, setPersistence, User,  } from 'firebase/auth';
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
        <Navigation colorScheme={colorScheme} auth={auth} user={user} data={data} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}


