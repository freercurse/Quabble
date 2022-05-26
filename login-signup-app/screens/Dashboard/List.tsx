import React, { useEffect, useState } from "react";
import { View, Text } from "../../components/Themed";
import { SectionList, SectionListRenderItemInfo, StyleSheet } from "react-native"
import { nanoid } from 'nanoid/non-secure'
import { DataContext, UserContext } from "../../navigation";
import { collection, doc, DocumentData, Firestore, onSnapshot, orderBy, query, setDoc, QuerySnapshot } from "firebase/firestore";
import { User } from "firebase/auth";


export default function List() {
  const Dcontext: Firestore = React.useContext(DataContext);
  const Ucontext: User = React.useContext(UserContext);

  const [records, setRecords] = useState<DocumentData>([])

  useEffect(() => {
    const collectionRef = collection(Dcontext, 'Lists/Users/' + Ucontext.uid + '/Records/Private');
    const q = query(collectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot) => {
      if (querySnapshot.empty) {
        initalSetup()
      }

      setRecords(querySnapshot.docs)

    }, (error) => { console.log(error) });


    return () => unsubscribe();
  }, [])

  const initalSetup = () => {
    setDoc(doc(Dcontext, 'Lists/Users/' + Ucontext.uid + '/Records/Private/' + nanoid()), {
      Title: "Welcome",
      Message: "Hello and Welcome to your private Lists, create and share to your hearts content!",
      Completed: false,
      shared: false,
      createdAt: Date.now().toLocaleString('en-GB')
    })
  }

  const getItems = (item: any) => {
    console.log(item)
    return (
      <View style={styles.item}>
        <Text>
          {item.data.Title}
        </Text>
      </View>
    )
  }

  const getTitles = (section: any) => {
    console.log(section, records)
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
      />
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
    paddingHorizontal: 80,
    paddingVertical: 20,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: 'black',
    borderRadius: 20
  },
  header: {
    borderWidth: 1,
    paddingTop: 10,
    paddingLeft: 80,
    paddingRight: 80,
    paddingBottom: 10,
    borderStyle: "solid",
    borderColor: 'black',
    borderRadius: 20
  },
})