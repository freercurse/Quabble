import React, { useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';

export default function Space({ spaceID, spaceValue, setTurn }: { spaceID: Number, spaceValue: String, setTurn: any }) {

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

