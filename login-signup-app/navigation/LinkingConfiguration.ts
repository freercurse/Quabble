/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { RootStackParamList } from '../types';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          Login: {
            screens: {
              Login: 'Login',
            },
          },
          Register: {
            screens: {
              Register: 'Register',
            },
          },
        },
      },      
      Dashboard: {
        screens: {
          Game: 'Game',
          Chat: 'Chat',
          Home: 'Home',
          List: 'List'
        }
      },
      FAQ: 'FAQ',
      NotFound: '*',
      ListItem: 'ListItem'
    },
  },
};

export default linking;
