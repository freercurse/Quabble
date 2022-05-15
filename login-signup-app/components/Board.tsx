import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Space from './Space';


export default function Board(checkTurn: any) {
  console.log(checkTurn.turns)
  return (
    <View style={boardStyle.container}>
      <View style={boardStyle.board}>
        <View style={boardStyle.row}>
          <Space spaceID={0} spaceValue={checkTurn.turns[0]} setTurn={checkTurn.checkTurn} />
          <Space spaceID={1} spaceValue={checkTurn.turns[1]} setTurn={checkTurn.checkTurn} />
          <Space spaceID={2} spaceValue={checkTurn.turns[2]} setTurn={checkTurn.checkTurn} />
        </View>
        <View style={boardStyle.row}>
          <Space spaceID={3} spaceValue={checkTurn.turns[3]} setTurn={checkTurn.checkTurn} />
          <Space spaceID={4} spaceValue={checkTurn.turns[4]} setTurn={checkTurn.checkTurn} />
          <Space spaceID={5} spaceValue={checkTurn.turns[5]} setTurn={checkTurn.checkTurn} />
        </View>
        <View style={boardStyle.row}>
          <Space spaceID={6} spaceValue={checkTurn.turns[6]} setTurn={checkTurn.checkTurn} />
          <Space spaceID={7} spaceValue={checkTurn.turns[7]} setTurn={checkTurn.checkTurn} />
          <Space spaceID={8} spaceValue={checkTurn.turns[8]} setTurn={checkTurn.checkTurn} />
        </View>
      </View>
    </View>
  );
};

const boardStyle = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  board: {
    backgroundColor: '#25cc6a',
  },
  row: {
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
});