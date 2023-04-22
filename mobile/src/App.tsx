import React from 'react';

import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import Routes from './routes';
import { CustomThemeProvider } from './contexts/ThemeContext';
import { UserProvider } from './contexts/UserContext';

export default function App() {
  return (
    <NavigationContainer>
      <CustomThemeProvider>
        <UserProvider>
          <SafeAreaView style={{ flex: 1 }}>
            <Routes />
          </SafeAreaView>
        </UserProvider>
      </CustomThemeProvider>
    </NavigationContainer>
  );
}
