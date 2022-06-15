import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { getDatabase } from "firebase/database";
import { initializeApp } from 'firebase/app';
import { Bytes, getFirestore } from "firebase/firestore";
import { LogBox, StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';


import React, { useState } from 'react';

const firebaseConfig = {
  apiKey: "AIzaSyCtaianGPpG03qcyE3YPY5oay3SvXkq8P4",
  authDomain: "quabble-7fced.firebaseapp.com",
  databaseURL: "https://quabble-7fced-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "quabble-7fced",
  storageBucket: "quabble-7fced.appspot.com",
  messagingSenderId: "86011789417",
  appId: "1:86011789417:web:a4d14934164165fb5922f8",
  measurementId: "G-BL9KXEWCBV"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const data = getFirestore(app);

import { getAuth, onAuthStateChanged, User, } from 'firebase/auth';

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
        <PaperProvider>        
          <Navigation colorScheme={colorScheme} auth={auth} user={user} data={data} database={database} />
        </PaperProvider>
        <StatusBar />
      </SafeAreaProvider>

    );
  }
}