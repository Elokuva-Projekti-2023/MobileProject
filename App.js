import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Home from './components/Home';
import Favourites from './components/Favourites';
import AboutToWatch from './components/AboutToWatch';
import AuthScreen from './components/AuthScreen';
import Login from './components/Login';

import Ionicons from '@expo/vector-icons/Ionicons';
import Profile from './components/Profile';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MainStack" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={Profile} options={{ headerShown: true }} />
      <Stack.Screen name="Login" component={Login} options={{ headerShown: true }} />
      <Stack.Screen name="AuthScreen" component={AuthScreen} options={{ headerShown: true }} />

      
    </Stack.Navigator>
  );
}

function TabNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const checkLoginStatus = async () => {
        try {
          const token = await AsyncStorage.getItem('token');

          setIsLoggedIn(!!token);
        } catch (error) {
          console.error('Error checking login status:', error);
          setIsLoggedIn(false);
        }
      };

      checkLoginStatus();
    }, [])
  );
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
         
          if (route.name === 'Home') {
            iconName = 'md-home';
          } else if (route.name === 'Favourites' && isLoggedIn) {
            iconName = 'star';
          } else if (route.name === 'Watch Later' && isLoggedIn) {
            iconName = 'film'
          }

          return <Ionicons name={ iconName } size={ size } color={ color } />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      {isLoggedIn && (
        <>
          <Tab.Screen name="Favourites" component={Favourites} />
          <Tab.Screen name="Watch Later" component={AboutToWatch} />
        </>
      )}  
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={MainStack} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={Profile} options={{ headerShown: true }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}