import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useState, useEffect, route, createContext } from "react";

import { StyleSheet } from 'react-native';
import Home from './components/Home';
import Favourites from './components/Favourites';
import AboutToWatch from './components/AboutToWatch';

import Ionicons from '@expo/vector-icons/Ionicons';
import LoginForm from './components/LoginForm';
import SplashScreen from './components/SplashScreen';

const Tab = createBottomTabNavigator();
const AuthContext = createContext();

export default function App({ navigation }) {

  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        // Restore token stored in `SecureStore` or any other encrypted storage
        // userToken = await SecureStore.getItemAsync('userToken');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

const authContext = React.useMemo(
  () => ({
    signIn: async (data) => {
      // In a production app, you need to send some data (usually username, password) to a server and get a token
      // You will also need to handle errors if sign in fails
      // After getting the token, you need to persist it using `SecureStore` or any other encrypted storage
      // In the example, you can use a dummy token

      dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
    },
    signOut: () => dispatch({ type: 'SIGN_OUT' }),
    signUp: async (data) => {
      // In a production app, you need to send user data to a server and get a token
      // You will also need to handle errors if sign up fails
      // After getting the token, you need to persist it using `SecureStore` or any other encrypted storage
      // In the example, you can use a dummy token

      dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
    },
  }),
  []
);
    
  return (
    <AuthContext.Provider value={authContext}>
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
        {state.isLoading ? (
          
          <Tab.Screen name='Spalsh' component={SplashScreen} />
          
        ) : state.userToken == null ? (
          <Tab.Screen 
            name='Login'
            component={LoginForm}
            options={{
              title: 'Login',
              animationTypeForReplace: state.isSignout ? 'pop' : 'push',
            }}
          />
        ) : (
          <>
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Favourites" component={Favourites} />
          <Tab.Screen name="AboutToWatch" component={AboutToWatch} /> 
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
    </AuthContext.Provider>
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
