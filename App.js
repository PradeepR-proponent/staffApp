import React from 'react';
import store from './src/store';
import {Provider} from 'react-redux';
import RootStack from './src/components/RootStack';
import {Provider as PaperProvider } from 'react-native-paper';

export default function App() {

  return (
    <Provider store={store} >
      <PaperProvider>
        <RootStack/>
      </PaperProvider>
    </Provider>
  );
}

