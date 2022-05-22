import { StatusBar } from 'expo-status-bar';
import { Button, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import { GiftedChat, IMessage, Message } from 'react-native-gifted-chat';
import {collection, addDoc, orderBy, query, onSnapshot, Firestore, DocumentData} from 'firebase/firestore';

import { Auth, User } from 'firebase/auth';
import { RootTabScreenProps } from '../../types';
import { AuthContext, DataContext, UserContext } from '../../navigation';


export default function Chat({ navigation, }: RootTabScreenProps<'Chat'>) {
  const Acontext: Auth = React.useContext(AuthContext);
  const Ucontext: User = React.useContext(UserContext);  
  const Dcontext: Firestore = React.useContext(DataContext);
  
    
  const [messages, setMessages] = useState<IMessage | DocumentData | any>([]);

  useEffect(() => {
    const collectionRef = collection(Dcontext, 'Messages');
    const q = query(collectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, querySnapshot => {
      setMessages(
        querySnapshot.docs.map(doc => ({          
          _id: doc.data()._id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user
        }))
      );
    });

    return () => unsubscribe();
  }, []);
  
  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages : any) => GiftedChat.append(previousMessages, messages))
    const { _id, createdAt, text, user } = messages[0];
    addDoc(collection(Dcontext, 'Messages'), {      
      _id,
      createdAt,
      text,
      user
    });
  }, []);
  
  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        renderUsernameOnMessage={true}        
        showAvatarForEveryMessage={true}        
        renderAvatarOnTop={true}
        onSend={messages => onSend(messages)}
        user={{
          _id: Ucontext.uid,
          name: Ucontext.displayName ? Ucontext.displayName : Ucontext.email,
          avatar: Ucontext.photoURL ? Ucontext.photoURL : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
        }}
      />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
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
});