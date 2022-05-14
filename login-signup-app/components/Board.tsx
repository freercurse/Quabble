import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Space }  from './Space';


export const Board = ( turns: Array<String>, checkTurn:Function ) => {
  return (
    <View style={boardStyle.container}>
      <View style={boardStyle.board}>
        <View style={boardStyle.row}>
          <Space spaceID={0} spaceValue={turns[0]} setTurn={checkTurn} />
          <Space spaceID={1} spaceValue={turns[1]} setTurn={checkTurn} />
          <Space spaceID={2} spaceValue={turns[2]} setTurn={checkTurn} />
        </View>
        <View style={boardStyle.row}>
          <Space spaceID={3} spaceValue={turns[3]} setTurn={checkTurn} />
          <Space spaceID={4} spaceValue={turns[4]} setTurn={checkTurn} />
          <Space spaceID={5} spaceValue={turns[5]} setTurn={checkTurn} />
        </View>
        <View style={boardStyle.row}>
          <Space spaceID={6} spaceValue={turns[6]} setTurn={checkTurn} />
          <Space spaceID={7} spaceValue={turns[7]} setTurn={checkTurn} />
          <Space spaceID={8} spaceValue={turns[8]} setTurn={checkTurn} />
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