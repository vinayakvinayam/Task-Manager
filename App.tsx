/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import Component1 from "./src/Components/Component1"
import { store } from './src/Store/Store';
import { Provider } from 'react-redux';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (

    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >

      <Stack.Screen
        name="Component1"
        component={Component1}
      />
    </Stack.Navigator>

  )
}

function App(): React.JSX.Element {

  return (
    <Provider store={store}>
    <SafeAreaProvider>
      <NavigationContainer>
        <SafeAreaView style={{ flex: 1 }}>
          <HomeStack />
        </SafeAreaView>
      </NavigationContainer>
    </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
