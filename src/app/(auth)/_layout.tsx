import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const Layout = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="welcome" component={() => null} />
        <Stack.Screen name="sign-in" component={() => null} />
        <Stack.Screen name="sign-up" component={() => null} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Layout;
