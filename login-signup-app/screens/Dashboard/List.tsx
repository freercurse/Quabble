import React, { useEffect, useState } from "react";
import { View, Text } from "../../components/Themed";
import { SectionList, Image, StyleSheet, TouchableOpacity, NativeTouchEvent } from "react-native"
import { nanoid } from 'nanoid/non-secure'
import { DataContext, UserContext } from "../../navigation";
import { collection, doc, DocumentData, Firestore, onSnapshot, orderBy, query, setDoc, QuerySnapshot, updateDoc } from "firebase/firestore";
import { User } from "firebase/auth";
import { Checkbox } from 'react-native-paper';
import AntDesign from "@expo/vector-icons/build/AntDesign";
import { RootTabScreenProps} from "../../types";



export default function List({ navigation }: RootTabScreenProps<'List'>) {
  const Dcontext: Firestore = React.useContext(DataContext);
  const Ucontext: User = React.useContext(UserContext);

  const [records, setRecords] = useState<DocumentData>([])
  const [reference, setReference] = useState('')
  const [touchX, setTouchX] = useState<number>(0)


  useEffect(() => {
    const collectionRef = collection(Dcontext, 'Lists/Users/' + Ucontext.uid + '/Records/Private');
    const q = query(collectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot) => {
      if (querySnapshot.empty) {
        initalSetup()
      } else {
        setRecords(querySnapshot.docs.map(doc => doc.data()))
      }


      
    }, (error) => { console.log(error) });


    return () => unsubscribe();
  }, [])

  const initalSetup = () => {
    let id = nanoid()
    
    
    setDoc(doc(Dcontext, 'Lists/Users/' + Ucontext.uid + '/Records/Private/' + id), {
      id: id,
      Title: "Welcome",
      Message: "Hello and Welcome to your private Lists, create and share to your hearts content!",
      Completed: false,
      shared: false,
      createdAt: new Date().toUTCString()
    })
  }

  const getItems = (item: any) => {
    return (
      <View
        onTouchStart={e => setTouchX(e.nativeEvent.pageX)}
        onTouchEnd={e => {
          if (touchX - e.nativeEvent.pageX > 10)
            console.log('Swiped up')
        }}      
      >      
        <TouchableOpacity style={styles.item} onLongPress={() => { navigation.navigate("ListItem", {id:item.id}) } } >
          <Text style={styles.title}>{item.Title}</Text>
          <View style={styles.checkbox}>
            <Text>
              {item.Message}
            </Text>
            <Checkbox
              status={item.Completed ? 'checked' : 'unchecked'}
              onPress={() => {
                updateDoc(doc(Dcontext, 'Lists/Users/' + Ucontext.uid + '/Records/Private/' + item.id), {
                  Completed: !item.Completed,
                })
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  const getTitles = (section: any) => {

    return (
      <View style={styles.header}>
        <Text>
          {section.title}
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <SectionList
        sections={[
          { title: 'Private', data: records.filter((x: { shared: boolean; }) => x.shared == false) },
          { title: 'Shared', data: records.filter((x: { shared: boolean; }) => x.shared == true) }
        ]}
        renderItem={({ item }) => getItems(item)}
        renderSectionHeader={({ section }) => getTitles(section)}
        initialNumToRender={10}        
      />
      <TouchableOpacity
        onPress={() => { navigation.navigate('ListItem',{ id: nanoid() } ); }}
        activeOpacity={0.7}        
        style={styles.touchableOpacityStyle}          
        >
        <AntDesign size={50} name="pluscircle" />
      </TouchableOpacity>      
    </View>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    flex: 1,    
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: 35,
    paddingTop: 5,
    paddingBottom: 20,
    borderWidth: 3,
    borderStyle: "solid",
    borderColor: 'black',
    borderRadius: 20,
    margin:5
  },
  checkbox: {
    flex: 1,   
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
      
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 10
  },
  header: {
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 80,
    borderStyle: "solid",
    borderColor: 'black',
    borderRadius: 20,
    backgroundColor: 'black',
    margin: 5
  },
  touchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 25,
    bottom: 25,
  },  
})