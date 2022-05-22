import React, { useState, useEffect } from 'react'
import { StyleSheet, Modal, TouchableOpacity, Button, Alert, TextInput, Clipboard } from 'react-native';
import { Auth, User } from 'firebase/auth';
import { Text, View } from '../components/Themed';
import { AuthContext, DBContext, UserContext } from '../navigation';
import { nanoid } from 'nanoid/non-secure'
import { Bounce } from 'react-native-animated-spinkit';
import Board  from '../components/Board';
import { ref, set, Database, onValue, update, remove } from 'firebase/database';
import { ConfirmDialog } from 'react-native-simple-dialogs';



export default function Game() {
  const Ucontext: User = React.useContext(UserContext);
  const DatabaseContext: Database = React.useContext(DBContext);

  const [playerTurn, changeTurn] = useState(false);
  const [quitter, setQuitter] = useState(false);
  const [end, endGame] = useState(true);
  const [opName, setOpName] = useState('')
  const [creName, setCreName] = useState('')
  const [modal, toggleModal] = useState(true);  
  const [waiting, setWaiting] = React.useState(false);
  const [ID, setID] = useState(nanoid());
  const [turns, setTurns] = useState<Array<String>>(['']);
  const [prompt, setPrompt] = React.useState(false);
  const [Gamestate, setGameState] = React.useState<any>();
  const [DBRef, setDBRef] = React.useState<any>();

  useEffect(() => {
    //both players have joined and are ready
    if (Gamestate?.Ready == true && waiting == true) {
      newGame()
      setWaiting(false)
      playerTurn ? setOpName(Gamestate?.OPName) : setCreName(Gamestate?.CREName)
    } 
    //one person has quite so end the game
    if (Gamestate?.Quit) {
      if (quitter) {
        alert("Your have quit the game")
      } else {
        alert("Your Oponent has ended the game")
        remove(DBRef)
      }
      
      finishGame()
    }
    //a winner has been declared by someone, determine if draw and display screen
    if (Gamestate?.Winner == true) {
      Alert.alert(
        Gamestate.Mover != playerTurn ? 'Congratulations' : 'Game Over',
        "Do you want to play again?",
        [
          {
            text: "Yes",
            onPress: () => update(DBRef, { BoardState: [''], Mover: Gamestate?.Mover, Winner: null})
          },
          { text: "No", onPress: () => setTimeout(() => { quitGame() }, 500) }
        ]
      );
    } else if (Gamestate?.Winner == false && Gamestate?.BoardState.length > 1 ){
      Alert.alert(
        "Draw",
        "Do you want to play again?",
        [
          {
            text: "Yes",
            onPress: () => update(DBRef, { BoardState: [''], Mover: Gamestate?.Mover, Winner: null })
          },
          { text: "No", onPress: () => setTimeout(() => { quitGame() }, 500) }
        ]
      );

      
    }
    //Auto update the board state when a turn is declared
    setTurns(Gamestate?.BoardState)    

  },[Gamestate])

  //set DB reference for the room and display the id to the user
  const createRoom = () => {
    setID(nanoid())
    const reference = ref(DatabaseContext, 'Game/' + ID);
    
    set(reference, {
      CREName: Ucontext.displayName,     
      Ready: false,      
      Mover: true,
      BoardState: [''],
    });

    Alert.alert(
      'Share this room ID to your friend',
      ID,
      [
        { text: 'Copy', onPress: () => { Clipboard.setString(ID)} },
        { text: 'Done' },
      ]
    );

    changeTurn(true)
    setWaiting(true)
    toggleModal(false)
    setGame(ID)
  }
  //declare reference and stor in state, initialising listener to update state
  const setGame = (id: string) => {

    const reference = ref(DatabaseContext, 'Game/' + ID);
    setDBRef(reference)
    onValue(reference, (snapshot) => {
      const Game = snapshot.val();      
      setGameState(Game)
    })  
  }

  //try to create a reference to the given ID fail if reference not found
  const joinRoom = async () => {
    await setGame(ID)

    if (Gamestate == null) {
      alert("Game does not exist! \nTry Again.")         
    } else {      
      setPrompt(false)
      setWaiting(true)
      toggleModal(false)
      changeTurn(false)

      update(DBRef, {
        OPName: Ucontext.displayName,        
        Ready: true,        
      });
    }            
  }
  //set the Quit game state
  const quitGame = () => {
    setQuitter(true)
    set(DBRef, {      
      Quit: true,
      
    });
  }

  //Hook to set a new game
  const newGame = () => {
    setTurns([]);
    endGame(false);
    toggleModal(false);    
  };

  //Hook to end the game and render components needed
  const finishGame = () => {
    setPrompt(false)
    toggleModal(true)
    endGame(true);
    setWaiting(false)
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
        update(DBRef, {
          Winner: true
        });        
      }
    }

    //when the board is full with no winner, it results in a tie
    if (Object.keys(turns).length === 9) {      
      update(DBRef, {
        Winner: false
      });
    }
  }

  const checkTurn = (value: number) => {    
    if (playerTurn == Gamestate?.Mover) {
      
      const tempTurns = turns;
      tempTurns[value] = playerTurn ? 'X' : 'O';
       

      //Here we call a function to check if the game is won abd change players
      checkWinner();

      update(DBRef, {
        BoardState: tempTurns,
        Mover: !playerTurn,
      });
    }
    
  }

  return (
    <View style={mainApp.container}>
      <Text style={mainApp.paragraph}>Let's play Tic-Tac-Toe!</Text>
      { playerTurn == Gamestate?.Mover &&<Text style={mainApp.paragraph}>Your Turn</Text>}

      {!end &&
        <Board
        checkTurn={checkTurn}
        turns={turns}
        Quit={quitGame}
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
            onPress={() => { setWaiting(false), toggleModal(true), remove(DBRef) }}
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
          <TextInput defaultValue={''} onChangeText={(id: string) => setID(id.trim())} style={mainApp.input} />
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
        <Text style={mainApp.subheader}>X - {creName != '' ? creName : Ucontext.displayName}</Text>
        <Text style={mainApp.subheader}>O - {opName != '' ? opName : Ucontext.displayName }</Text>
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
