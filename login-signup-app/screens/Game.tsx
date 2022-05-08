import React, { useRef } from 'react'
import { Component, useEffect } from 'react';
import { Alert, Button, LogBox, StyleSheet, TextInput } from 'react-native';

import { Auth, User } from 'firebase/auth';

import { Text, View } from '../components/Themed';
import { AuthContext, UserContext } from '../navigation';

import Pusher from 'pusher-js/react-native';
import shortid  from 'shortid';
import Spinner from 'react-native-spinkit';
import { ConfirmDialog } from 'react-native-simple-dialogs';


 

export default function Game() {
  LogBox.ignoreLogs(['Require cycle:', 'AsyncStorage ']);

  const Ucontext: User = React.useContext(UserContext);
  const Acontext: Auth = React.useContext(AuthContext);

  const [pusher, setPusher] = React.useState<any>();
  const [channel, setChannel] = React.useState();
  const [binded, setBinded] = React.useState(false);

  const [username, setUsername] = React.useState(Ucontext.displayName);
  const [id, setId] = React.useState("");
  const [piece, setPiece] = React.useState(Ucontext.displayName);
  const [rival, setRival] = React.useState('');
  const [playing, setPlaying] = React.useState(false);
  const [prompt, setPrompt] = React.useState(false);
  const [waiting, setWaiting] = React.useState(false);
  const [creator, setCreator] = React.useState(false);

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      const pusher = new Pusher('3563919e02918c0b1a8b', {
        cluster: 'eu',
      });
      setPusher(pusher)
      isInitialMount.current = false;
    } else {

      if (waiting && !binded) {
        channel.bind('client-joined', (data: any) => {
          setWaiting(false)
          setPlaying(true)
          setRival(data.username)
        })
        setBinded(true)
      }

      if (creator) {
        channel.trigger('client-joined', {
          username: Ucontext.displayName
        });
      }
    }
    
  }, [creator])

  const onPressCreateRoom = () => {

    let room_id = shortid.generate(); // generate a unique ID for the room
    setChannel(pusher.subscribe('private-' + room_id)); // subscribe to a channel

    // alert the user of the ID that the friend needs to enter 
    Alert.alert(
      'Share this room ID to your friend',
      room_id,
      [
        { text: 'Done' },
      ],
      { cancelable: false }
    );

    // show loading state while waiting for someone to join the room
   
      setPiece('X') // room creator is always X
      setWaiting(true)
      setCreator(true)   

  }

  const onPressJoinRoom = () => {
    setPrompt(true)
  }

 

  const joinRoom = (room_id : string) => {
    setChannel(pusher.subscribe('private-' + room_id));
    // inform the room creator that a rival has joined
    channel.trigger('client-joined', {
      username: username
    });
    
    setPiece('O')
    setPrompt(false)
    setWaiting(true) // wait for the room creator to confirm   
  }

  const endGame = () => {
    // reset to the default state
    
      setUsername('')
      setPiece('')
      setRival('')
      setPlaying(false)
      setPrompt(false)
      setWaiting(false)
      setCreator(false)
    
    // reset the game channel
    setChannel(undefined);
    setBinded(false);
  }

  return (
    <View style={styles.container}>      

      <View style={styles.button_container}>
        <Button
          onPress={() => onPressCreateRoom()}
          title="Create Room"
          color="#4c87ea"          
        />
        <Button
          onPress={() => onPressJoinRoom()}
          title="Join Room"
          color="#1C1C1C"          
        />
      </View>
      
      {prompt && <ConfirmDialog
        title="Enter The room Name."
        visible={prompt}
        onTouchOutside={() => setPrompt(false)}
        positiveButton={{
          title: "Join",
          onPress: () => {
            joinRoom(id)            
          }
        }} >
        <View style={styles.Dcontainer}>
          <TextInput defaultValue={id} onChangeText={(id: string) => setId(id)} style={styles.input} />
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
  button_container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
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
  spinner: {
    flex: 1,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 50
  }

});
