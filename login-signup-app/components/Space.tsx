import React, { useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  spaceID: number
  spaceValue: String
  setTurn: Function
}


export const Space = ({ spaceID, spaceValue, setTurn } : Props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.space} onPress={() => { setTurn(spaceID) }} disabled={spaceValue ? true : false}>
        <Text style={styles.spaceValue}>{spaceValue}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',

  },
  space: {
    width: 80,
    height: 80,
    marginVertical: 5,
    marginHorizontal: 5,
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  spaceValue: {
    fontSize: 40,
    color: '#241239'
  }
});

