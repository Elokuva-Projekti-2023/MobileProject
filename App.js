import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { StyleSheet } from 'react-native';
import Home from './components/Home';
import Favourites from './components/Favourites';
import AboutToWatch from './components/AboutToWatch';
import Login from './components/Login';

import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig';

const Tab = createBottomTabNavigator();
const InsideTab = createBottomTabNavigator();

function InsideLayout() {
  return (
       <InsideTab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'md-home';
            } else if (route.name === 'Favourites') {
              iconName = 'heart';
            } else if (route.name === 'AboutToWatch') {
              iconName = 'film'
            } else if (route.name === 'Login') {
              iconName = 'log-in-outline'
            }

            return <Ionicons name={ iconName } size={ size } color={ color } />;
          },
        })
      }>
        <InsideTab.Screen name="Home" component={Home} />
        <InsideTab.Screen name="Favourites" component={Favourites} />
        <InsideTab.Screen name="AboutToWatch" component={AboutToWatch} />
        <InsideTab.Screen name="Login" component={Login} />
      </InsideTab.Navigator>
  )
}

export default function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
    });
  }, []);
    
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName='Login'>
        {user ? (
            <Tab.Screen name='Inside' component={InsideLayout} options={{headerShown: false}} />
        ) : (
          <Tab.Screen name='Login' component={Login} options={{headerShown: false}} />
        )}
      </Tab.Navigator>
    </NavigationContainer>
  )
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
