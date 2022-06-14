import React, { useEffect, useState } from "react";
import { View, Text } from "../../components/Themed";
import { SectionList, Image, StyleSheet, TouchableOpacity, NativeTouchEvent } from "react-native"
import { nanoid } from 'nanoid/non-secure'
import { DataContext, UserContext } from "../../navigation";
import { collection, doc, DocumentData, Firestore, onSnapshot, orderBy, query, setDoc, QuerySnapshot, updateDoc, getDocs, deleteDoc, DocumentReference } from "firebase/firestore";
import { User } from "firebase/auth";
import { Checkbox } from 'react-native-paper';
import AntDesign from "@expo/vector-icons/build/AntDesign";
import { RootTabScreenProps} from "../../types";
import { ConfirmDialog } from "react-native-simple-dialogs";



export default function List({ navigation }: RootTabScreenProps<'List'>) {
  const Dcontext: Firestore = React.useContext(DataContext);
  const Ucontext: User = React.useContext(UserContext);

  const [records, setRecords] = useState<DocumentData>([])
  const [publicRecords, setPublicRecords] = useState<DocumentData>([])
  const [prompt, setPrompt] = useState(false)
  const [share, setShare] = useState<any>()
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
  
  useEffect(() => {
    const collectionRef = collection(Dcontext, 'Lists/Public/Records' );
    const q = query(collectionRef, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot) => {
     let Rec : DocumentData = [];
     querySnapshot.docs.map(doc => {
      if(!doc.data().Registered.includes(Ucontext.displayName)){
        Rec.push(doc.data())
      }      
      
    })
      setPublicRecords(Rec)

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

  const deleteRecord = (item:any) => {

    let Reg = item.Registered
    
    if(!item.shared){

      deleteDoc(doc(Dcontext, 'Lists/Users/' + Ucontext.uid + '/Records/Private/' + item.id))
    } else {      
      Reg.push(Ucontext.displayName)

      updateDoc(doc(Dcontext, 'Lists/Public/Records/' + item.id), {
        Registered: Reg
      })
    }   

  }

  const shareRecord = () => {

    setDoc(doc(Dcontext, 'Lists/Public/Records/' + share.id), {
      id: share.id,
      Title: share.Title,
      Message: share.Message,
      Completed: share.Completed,
      shared: true,
      createdAt: share.createdAt,
      Registered : [Ucontext.displayName]
    })
    
    alert("Note has been shared")
  }

  const getItems = (item: any) => {
    return (
      <View
        onTouchStart={e => setTouchX(e.nativeEvent.pageX)}
        onTouchEnd={e => {
          if (touchX - e.nativeEvent.pageX > 20){
            setShare(item)
            if(!item.shared) setPrompt(true)
          } else if (e.nativeEvent.pageX - touchX > 20){
            deleteRecord(item)
          }
            
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
                !item.shared ?
                updateDoc(doc(Dcontext, 'Lists/Users/' + Ucontext.uid + '/Records/Private/' + item.id), {
                  Completed: !item.Completed,
                }): alert("This is a public record you cannot change the status")
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
          { title: 'Shared', data: publicRecords.filter((x: { shared: boolean; }) => x.shared == true) }
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

      {prompt && <ConfirmDialog
        visible={prompt}
        title="Share Publicly!"
        onTouchOutside={() => setPrompt(false)}
        positiveButton={{
          title: "Share",
          onPress: () => {
            shareRecord()
            setPrompt(false)
          }
        }} >
        <View style={styles.paragraph} >
          <Text style={styles.paragraph}>Are you sure you want to share this not publicly with everyone using this APP!!</Text>
        </View>
      </ConfirmDialog>}     
    </View>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paragraph: {
    margin: 10,
    fontSize: 18,    
    textAlign: 'left',
    color: 'black',
    backgroundColor:'white',
    borderColor: 'black'
  },
  item: {
    flex: 1,    
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: 60,
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
    marginLeft:10
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
  }
   
})