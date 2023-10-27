import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useState, useEffect, route } from "react";

import { StyleSheet } from 'react-native';
import Home from './components/Home';
import Favourites from './components/Favourites';
import AboutToWatch from './components/AboutToWatch';

import Ionicons from '@expo/vector-icons/Ionicons';
import LoginForm from './components/LoginForm';
import SplashScreen from './components/SplashScreen';

const Tab = createBottomTabNavigator();

export default function App() {

  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  const getUserToken = async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    try {
      await sleep(2000);
      const token = null;
      setUserToken(token);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserToken();
  }, []);

  if (isLoading) {
    return <SplashScreen />
  }
    
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'md-home';
            } else if (route.name === 'Favourites') {
              iconName = 'heart';
            } else if (route.name === 'AboutToWatch') {
              iconName = 'film';
            } else if (route.name === 'LoginForm') {
              iconName = 'log-in-outline';
            }

            return <Ionicons name={ iconName } size={ size } color={ color } />;
          },
        })
      }>
        {userToken == null ? (
          <>
          <Tab.Screen name='LoginForm' component={LoginForm} initialParams={{ setUserToken }} />
          </>
        ) : (
          <>
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Favourites" component={Favourites} />
          <Tab.Screen name="AboutToWatch" component={AboutToWatch} /> 
      
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  flatListContainer: {
    justifyContent: 'space-between', 
  },
  itemContainer: {
    width: '30%',
    margin: 6,
    alignItems: 'center',
  },
  image: {
    width: 113,
    height: 170,
    borderRadius: 5,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
    textAlign: 'center',
  },
});
