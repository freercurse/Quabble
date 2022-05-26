import React, { useState } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import Space from './Space';


export default function Board(props: any) {
  return (
    <View style={boardStyle.container}>
      <Button
        onPress={() => { props.Quit() }}
        title="Quit Game"
        color="#4c87ea"
      />
      <View style={boardStyle.board}>
        <View style={boardStyle.row}>
          <Space spaceID={0} spaceValue={props.turns[0]} setTurn={props.checkTurn} />
          <Space spaceID={1} spaceValue={props.turns[1]} setTurn={props.checkTurn} />
          <Space spaceID={2} spaceValue={props.turns[2]} setTurn={props.checkTurn} />
        </View>
        <View style={boardStyle.row}>
          <Space spaceID={3} spaceValue={props.turns[3]} setTurn={props.checkTurn} />
          <Space spaceID={4} spaceValue={props.turns[4]} setTurn={props.checkTurn} />
          <Space spaceID={5} spaceValue={props.turns[5]} setTurn={props.checkTurn} />
        </View>
        <View style={boardStyle.row}>
          <Space spaceID={6} spaceValue={props.turns[6]} setTurn={props.checkTurn} />
          <Space spaceID={7} spaceValue={props.turns[7]} setTurn={props.checkTurn} />
          <Space spaceID={8} spaceValue={props.turns[8]} setTurn={props.checkTurn} />
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