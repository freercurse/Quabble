import { User } from "firebase/auth";
import { doc, Firestore, setDoc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, TextInput } from "react-native";
import { DataContext, UserContext } from "../../navigation";
import { View } from "../Themed";


export default function ListItem(route: any, navigation: any) {
  const { id } = route.route.params; 
  const { goBack } = route.navigation; 
  
  const [Text, setText] = useState('')
  const [Title, setTitle] = useState('')
  const [type, setType] = useState(false)
  const Dcontext: Firestore = React.useContext(DataContext);  
  const Ucontext: User = React.useContext(UserContext);

  useEffect(() => {    

    getDoc(doc(Dcontext, 'Lists/Users/' + Ucontext.uid + '/Records/Private/' + id)).then(doc => {
      if (doc.exists()) {
        setTitle(doc.data().Title)
        setText(doc.data().Message)
        setType(true)
      }
    })
  },[])

  const setBulletPoint = () => {    
    setText(Text + '\u2022 ')    
  }
  
  const submit = () => {      
    setDoc(doc(Dcontext, 'Lists/Users/' + Ucontext.uid + '/Records/Private/' + id), {
      id: id,
      Title: Title,
      Message: Text,
      Completed: false,
      shared: false,
      createdAt: new Date().toUTCString()
    }).then(() => { goBack() })
  }

  const update = () => {      
    updateDoc(doc(Dcontext, 'Lists/Users/' + Ucontext.uid + '/Records/Private/' + id), {
      id: id,
      Title: Title,
      Message: Text,
      Completed: false,
      shared: false,
      createdAt: new Date().toUTCString()
    }).then(() => { goBack() })
  }
  
  return (
    <View style={styles.container}>
      <TextInput style={styles.input}
        placeholder="Enter your Title"
        onChangeText={(text) => { setTitle(text) }}
        maxLength={30}
        value={Title }
      />    
      <TextInput style={styles.input}
        placeholder="Enter your Note"
        onChangeText={(text) => { setText(text) }}
        multiline={true}
        value={Text}
      />    
      <View style={styles.Buttons }>
        <Button title="BulletPoint" onPress={() => { setBulletPoint() }} />
      </View>
        <View style={styles.Buttons}>
        <Button title="Submit" onPress={() => { type ?update() : submit() }} />
      </View>
    </View>
    
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: 300,
    maxHeight: 300,
    padding: 5,
    borderRadius:15,
    borderStyle: 'solid',
    borderWidth: 3,
    borderColor: '#000',
    margin: 10,
  },
  Buttons: {
    alignItems: 'flex-end',
    margin:20
  }
});

