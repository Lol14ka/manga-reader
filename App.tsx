import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { LoginScreen } from './src/screens/LoginScreen';
import { MangaScreen } from './src/screens/MangaScreen';
import NewChapterScreen from './src/screens/NewChapterScreen';
import ReaderScreen from './src/screens/ReaderScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import SearchScreen from './src/screens/SearchScreen';

export type RootStackParamList = {
  manga: { id?: number };
  newChapter: { manga_id: number };
  search?: {
    only_creator?: boolean;
    only_subscription?: boolean;
  };
  reader: {
    chapter_id: number;
    page?: number;
    direction?: string;
  };
};

const MangaReader = createNativeStackNavigator<RootStackParamList>();

const MangaReaderNavigator = () => {
  return (
    <MangaReader.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <MangaReader.Screen name="search" component={SearchScreen} />
      <MangaReader.Screen name="manga" component={MangaScreen} />
      <MangaReader.Screen name="reader" component={ReaderScreen} />
      <MangaReader.Screen name="newChapter" component={NewChapterScreen} />
    </MangaReader.Navigator>
  );
};

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="home" component={MangaReaderNavigator} />
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="register" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
