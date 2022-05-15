import React, { useRef, useState } from 'react'
import { Component, useEffect } from 'react';
import { StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Auth, User } from 'firebase/auth';
import { Text, View } from '../components/Themed';
import { AuthContext, UserContext } from '../navigation';
import Board  from '../components/Board';



export default function Game() {
  const [playerTurn, changeTurn] = useState(true);
  const [end, endGame] = useState(true);
  const [modal, toggleModal] = useState(true);

  //Result message for winner and tie games
  const [result, setResult] = useState('');

  //Turns dictionary to store turns taken
  const [turns, setTurns] = useState<Array<String>>(['']);

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
    console.log(turns)
    //Sets the turn state with the new value added
    setTurns(tempTurns);

    //Here we call a function to check if the game is won abd change players
    checkWinner();
    togglePlayer();
  }

  return (
    <View style={mainApp.container}>
      <Text style={mainApp.paragraph}>Let's play Tic-Tac-Toe!</Text>
      {!end && (
        <Board
          checkTurn={checkTurn}
          turns={turns}          
        />
      )}
      <Modal animationType={'slide'} visible={modal}>
        <View style={mainApp.centeredView}>
          <View style={mainApp.modalView}>
            <Text style={mainApp.h2}>{result}</Text>
            <TouchableOpacity style={mainApp.purpleButton} onPress={newGame}>
              <Text style={mainApp.whiteButtonText}>Start a new game</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={mainApp.legend}>
        <Text style={mainApp.subheader}>X - Player 1</Text>
        <Text style={mainApp.subheader}>O - Player 2</Text>
      </View>
    </View>
  );
}

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
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  h2: {
    margin: 10,
    fontSize: 16,
    padding: 5,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#25cc6a',
  },
  purpleButton: {
    backgroundColor: '#241239',
    padding: 5,
    borderRadius: 5,
  },
  whiteButtonText: {
    margin: 10,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
});
