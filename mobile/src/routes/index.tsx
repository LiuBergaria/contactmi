import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import { useUser } from '../contexts/UserContext';

// Screens
import Login from '../screens/Login';
import CreateAccount from '../screens/CreateAccount';
import Home from '../screens/Home';

const Stack = createStackNavigator();

function Routes() {
  const { user } = useUser();

  return (
    <Stack.Navigator
      headerMode="none"
      initialRouteName={user ? 'Home' : 'Login'}
    >
      {user ? (
        <>
          <Stack.Screen name="Home" component={Home} />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              animationTypeForReplace: !user ? 'pop' : 'push',
            }}
          />
          <Stack.Screen
            name="CreateAccount"
            component={CreateAccount}
            options={{
              animationTypeForReplace: !user ? 'pop' : 'push',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default Routes;
