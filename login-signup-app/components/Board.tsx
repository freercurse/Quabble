import React, { Component, useEffect, useState } from 'react';

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Alert
} from 'react-native';

import range from 'lodash.range';

export const Board = (channel: any, piece:number,creator:string, endGame:Function, username : string, rival : string) => {

 const combo = [
    [0, 3, 6],
    [1, 4, 7],
    [0, 1, 2],
    [3, 4, 5],
    [2, 5, 8],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  const ids = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8]
  ];

  const rowsVal = [
    range(3).fill(0), 
    range(3).fill(0),
    range(3).fill(0)
  ];
  //Values set on entry
  const [combinations, setCombination] = useState(combo)
  const [id, setID] = useState(ids)
  const [rows, setRows] = useState(rowsVal)
  //state for game
  const [XScore, setXScore] = useState(0)
  const [OScore, setOScore] = useState(0)
  const [moves, setMoves] = useState<Array<number>>(range(9).fill(9))

  useEffect(() => {    

    channel.bind('client-make-move', (data: any) => {
      let open = moves;
      let id = ids[data.row_index][data.index]; // get the ID based on the row index and block index
      open[id] = data.piece; // set the piece

      // update the UI
      setMoves(open)

      updateScores(open); // update the user scores
    })

  }, [channel])

  const updateScores = (moves: Array<number>) => {

    var pieces = {
      'X': 0,
      'O': 0
    }

    function isInArray(moves: Array<number>, piece:number, element:any, index:number, array:Array<any>) {
      return moves[element] && moves[element] == piece; // check if there's a piece assigned to a specific block and that piece is the piece we're looking for (either "X" or "O")
    }

    combinations.forEach((p_row) => {
      if (p_row.every(isInArray.bind(null, moves, 1))) {
        pieces['X'] += 1;
      } else if (p_row.every(isInArray.bind(null, moves, 0))) {
        pieces['O'] += 1;
      }
    });

    setXScore(pieces['X'])
    setOScore(pieces['O'])
    

  }

  const onMakeMove = (row_index:number, index:number) => {
    let open = moves;
    let ids = id[row_index][index];

    if (!open[ids]) { // nobody has occupied the space yet
      open[ids] = piece;
      setMoves(open)

      updateScores(moves);

      // inform the rival that a move is made
      channel.trigger('client-make-move', {
        row_index: row_index,
        index: index,
        piece: piece
      });
    }
  }

  if (creator && moves.indexOf(9) == -1) {
    Alert.alert(
      "Restart Game",
      "Do you want to restart the game?",
      [
        {
          text: "Nope. Let's call it quits.",
          onPress: () => {
            setMoves(range(9).fill(9))
            setXScore(0)
            setOScore(0)            
            endGame();
          },
          style: 'cancel'
        },
        {
          text: 'Heck yeah!',
          onPress: () => {
            setMoves(range(9).fill(9))
            setXScore(0)
            setOScore(0)
          }
        },
      ],
      { cancelable: false }
    );
  }

  const generateRows = () => {
    return rows.map((row, index) => {
      return (
        <View style={styles.row} key={index}>
          {generateBlocks(row, index)}
        </View>
      );
    });
  }

  const generateBlocks = (row:Array<number>, row_index:number) => {
    return row.map((block:any, index:number) => {
      let id = ids[row_index][index];
      return (
        <TouchableHighlight
          key={index}
          onPress={ () => onMakeMove.bind(row_index, index)}
          underlayColor={"#CCC"}
          style={styles.block}>
          <Text style={styles.block_text}>
            {moves[id]}
          </Text>
        </TouchableHighlight>
      );
    });
  }
 
  return (
    <View style={styles.board_container}>
      <View style={styles.board}>
        {generateRows()}
      </View>

      <View style={styles.scores_container}>
        <View style={styles.score}>
          <Text style={styles.user_score}>{XScore}</Text>
          <Text style={styles.username}>{username} (1)</Text>
        </View>

        <View style={styles.score}>
          <Text style={styles.user_score}>{OScore}</Text>
          <Text style={styles.username}>{rival} (0)</Text>
        </View>
      </View>
    </View>
  );
  
  


}

const styles = StyleSheet.create({
  board_container: {
    flex: 9
  },
  board: {
    flex: 7,
    flexDirection: 'column'
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  block: {
    flex: 1,
    borderRightWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center'
  },
  block_text: {
    fontSize: 30,
    fontWeight: 'bold'
  },
  scores_container: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center'
  },
  score: {
    flex: 1,
    alignItems: 'center'
  },
  user_score: {
    fontSize: 25,
    fontWeight: 'bold'
  },
  username: {
    fontSize: 20
  }
});