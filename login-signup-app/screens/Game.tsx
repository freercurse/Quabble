import React, { useState, useEffect } from 'react'
import { StyleSheet, Modal, TouchableOpacity, Button, Alert, TextInput } from 'react-native';
import { Auth, User } from 'firebase/auth';
import { Text, View } from '../components/Themed';
import { AuthContext, DBContext, UserContext } from '../navigation';
import { nanoid } from 'nanoid/non-secure'
import { Bounce } from 'react-native-animated-spinkit';
import Board  from '../components/Board';
import { ref, set, Database, onValue } from 'firebase/database';
import { ConfirmDialog } from 'react-native-simple-dialogs';



export default function Game() {
  const Ucontext: User = React.useContext(UserContext);
  const DatabaseContext: Database = React.useContext(DBContext);

  const [playerTurn, changeTurn] = useState(true);
  const [end, endGame] = useState(true);
  const [modal, toggleModal] = useState(true);
  const [result, setResult] = useState('');
  const [waiting, setWaiting] = React.useState(false);
  const [ID, setID] = useState(nanoid());
  const [turns, setTurns] = useState<Array<String>>(['']);
  const [prompt, setPrompt] = React.useState(false);
  const [Gamestate, setGameState] = React.useState<any>();

  useEffect(() => {
    if (Gamestate?.Ready == true && waiting == true) {
      newGame()
      setWaiting(false)
    }



  },[Gamestate])

  const createRoom = () => {
    setID(nanoid())
    const reference = ref(DatabaseContext, 'Game/' + ID);
    
    set(reference, {
      name: Ucontext.displayName,
      creator: true,
      Ready: waiting,
      moves: turns,
    });

    Alert.alert(
      'Share this room ID to your friend',
      ID,
      [
        { text: 'Done' },
      ],
      { cancelable: false }
    );

    setWaiting(true)
    toggleModal(false)
    setGame(ID)
  }

  const setGame = (id: string) => {

    const reference = ref(DatabaseContext, 'Game/' + ID);
    onValue(reference, (snapshot) => {
      const Game = snapshot.val();      
      setGameState(Game)
    })  
  }

  const joinRoom = () => {
    setGame(ID)

    if (Gamestate == null) {
      alert("Game does not exist! \nTry Again.")         
    } else {
      setPrompt(false)
      setWaiting(true)
      toggleModal(false)
    }      
      
  }    

  //Hook toggles for components to render and switch players
  const togglePlayer = () => changeTurn(!playerTurn);
  const toggleGame = () => endGame(!end);
  const triggerModal = () => toggleModal(!modal)

  //Hook to set a new game
  const newGame = () => {
    setTurns([]);
    endGame(false);
    toggleModal(false);
    changeTurn(true);
  };

  //Hook to end the game and render components needed
  const finishGame = () => {
    endGame(true);
    triggerModal();
  };

  const checkWinner = () => {
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < winningCombos.length; i++) {
      const [a, b, c] = winningCombos[i];
      if (turns[a] === turns[b] && turns[b] === turns[c] && a in turns && b in turns && c in turns) {
        //Winner is determined
        setResult(playerTurn ? 'Congratulations Player 1!' : 'Nice going Player 2!');
        finishGame();
      }
    }

    //when the board is full with no winner, it results in a tie
    if (Object.keys(turns).length === 9) {
      setResult('Tie Game!');
      finishGame();
    }
  }

  const checkTurn = (value: number) => {
    const tempTurns = turns;
    tempTurns[value] = playerTurn ? 'X' : 'O';   
    //Sets the turn state with the new value added
    setTurns(tempTurns);

    //Here we call a function to check if the game is won abd change players
    checkWinner();
    togglePlayer();
  }

  return (
    <View style={mainApp.container}>
      <Text style={mainApp.paragraph}>Let's play Tic-Tac-Toe!</Text>
      {!end &&
        <Board
          checkTurn={checkTurn}
          turns={turns}
        />
      }

      {waiting &&
        <View>
          <Bounce
          style={mainApp.spinner}
            size={75}
            color={"#549eff"}
          />
          <Button
            onPress={() => { setWaiting(false), toggleModal(true) }}
            title="Cancel"
            color="#4c87ea"
          />
        </View>
      }

      {prompt && <ConfirmDialog
        visible={prompt}
        title="Enter The room Name."       
        onTouchOutside={() => setPrompt(false)}
        positiveButton={{
          title: "Join",
          onPress: () => {
            joinRoom()
            
          }
        }} >
        <View style={mainApp.Dcontainer}>
          <TextInput defaultValue={''} onChangeText={(id: string) => setID(id)} style={mainApp.input} />
        </View>
      </ConfirmDialog>}

      {modal && <View style={mainApp.centeredView}>
        <View style={mainApp.modalView}>          
          <TouchableOpacity style={mainApp.purpleButton} onPress={createRoom} >
            <Text style={mainApp.whiteButtonText}>Create a Room</Text>
          </TouchableOpacity>
          <View style={mainApp.split}/>
          <TouchableOpacity style={mainApp.purpleButton} onPress={() => { setPrompt(true) }}>
            <Text style={mainApp.whiteButtonText}>Join a Room</Text>
          </TouchableOpacity>
        </View>
      </View> ||
        <View style={mainApp.legend}>
          <Text style={mainApp.subheader}>X - Player 1</Text>
          <Text style={mainApp.subheader}>O - Player 2</Text>
        </View>}
    </View>
  );}

const mainApp = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#241239',
    padding: 8,
  },
  paragraph: {
    margin: 10,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  subheader: {
    margin: 10,
    fontSize: 14,
    padding: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#25cc6a',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#241239',
  },
  modalView: {    
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,        
  },
  h2: {
    justifyContent: 'space-between',

    margin: 10,
    fontSize: 16,
    padding: 5,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#25cc6a',
  },
  purpleButton: {
    backgroundColor: '#241239',
    padding: 2,
    borderRadius: 5,
    textAlign:'center'
  },
  whiteButtonText: {
    margin: 10,
    fontSize: 12,
    fontWeight: 'bold',   
    color: 'white',
  },
  split: {
    height: 40,
    backgroundColor:'white'
  },
  spinner: {
    flex: 1,   
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 100
  },
  Dcontainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
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
});
