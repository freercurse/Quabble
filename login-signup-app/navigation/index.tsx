/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { AntDesign, FontAwesome } from '@expo/vector-icons';

import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ColorSchemeName, Pressable } from 'react-native';

import { Auth, User } from 'firebase/auth';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';

import Game from '../screens/Dashboard/Game';
import FAQ from '../screens/Main/FAQ';
import NotFoundScreen from '../screens/NotFoundScreen';
import Login from '../screens/Main/Login';
import Register from '../screens/Main/Register';
import Chat from '../screens/Dashboard/Chat';
import Home from '../screens/Dashboard/Home';
import { Firestore } from 'firebase/firestore';
import { Database } from 'firebase/database';
import List from '../screens/Dashboard/List';
import ListItem from '../components/List/ListItem';


export const AuthContext = React.createContext<Auth | undefined>(undefined);
export const UserContext = React.createContext<User | undefined>(undefined);
export const DataContext = React.createContext<Firestore | undefined>(undefined);
export const DBContext = React.createContext<Database | undefined>(undefined);


export default function Navigation({ colorScheme, auth, user, data, database }: { colorScheme: ColorSchemeName, auth: Auth, user: User, data: Firestore, database: Database }) {

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthContext.Provider value={auth}>
        <UserContext.Provider value={user}>
          <DataContext.Provider value={data}>
            <DBContext.Provider value={database}>
              <RootNavigator />
            </DBContext.Provider>
          </DataContext.Provider>
        </UserContext.Provider>
      </AuthContext.Provider>
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {

  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Dashboard" component={DashboardBottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="FAQ" component={FAQ} />
        <Stack.Screen name="ListItem" component={ListItem} />
      </Stack.Group>
    </Stack.Navigator>
  )
}


/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {

  const colorScheme = useColorScheme();
  return (

    <BottomTab.Navigator
      initialRouteName="Login"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint
      }}>
      <BottomTab.Screen
        name="Login"
        component={Login}
        options={({ navigation }: RootTabScreenProps<'Login'>) => ({
          title: 'Login',
          tabBarIcon: ({ color }) => <TabBarIcon name="login" color={color} />,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('FAQ')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}>
              <FontAwesome
                name="info-circle"
                size={25}
                color={Colors[colorScheme].text}
                style={{ marginRight: 15 }} />
            </Pressable>
          ),
        })} />
      <BottomTab.Screen
        name="Register"
        component={Register}
        options={() => ({
          title: 'Register',
          tabBarIcon: ({ color }) => <TabBarIcon name="adduser" color={color} />
        })} />

    </BottomTab.Navigator>
  );
}

function DashboardBottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}>
      <BottomTab.Screen
        name="Home"
        component={Home}
        options={({ navigation }: RootTabScreenProps<'Home'>) => ({
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="profile" color={color} />,
        })} />
      <BottomTab.Screen
        name="Chat"
        component={Chat}
        options={({ navigation }: RootTabScreenProps<'Chat'>) => ({
          title: 'Chat',
          tabBarIcon: ({ color }) => <TabBarIcon name="message1" color={color} />,
        })} />
      <BottomTab.Screen
        name="Game"
        component={Game}
        options={({ navigation }: RootTabScreenProps<'Game'>) => ({
          title: 'Tic-Tac-Toe',
          tabBarIcon: ({ color }) => <TabBarIcon name="play" color={color} />,
        })} />
      <BottomTab.Screen
        name="List"
        component={List}
        options={({ navigation }: RootTabScreenProps<'List'>) => ({
          title: 'ToDo List',
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
        })} />


    </BottomTab.Navigator>
  );
}



/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof AntDesign>['name'];
  color: string;
}) {
  return <AntDesign size={30} style={{ marginBottom: -3 }} {...props} />;
}
