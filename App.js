import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import Home from './components/Home';
import Favourites from './components/Favourites';
import AboutToWatch from './components/AboutToWatch';
import AuthScreen from './components/AuthScreen';
import Login from './components/Login';

import Ionicons from '@expo/vector-icons/Ionicons';
import Profile from './components/Profile';

//dotenv.config();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={Profile} options={{ headerShown: true }} />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Home') {
            iconName = 'md-home';
          } else if (route.name === 'Favourites') {
            iconName = 'star';
          } else if (route.name === 'Watchlist') {
            iconName = 'film'
          } else if (route.name === 'AuthScreen') {
            iconName = 'log-in-outline'
          } else if (route.name === 'Login') {
            iconName = 'log-in-outline'
          } 

          return <Ionicons name={ iconName } size={ size } color={ color } />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Favourites" component={Favourites} />
      <Tab.Screen name="Watchlist" component={AboutToWatch} />
      <Tab.Screen name="AuthScreen" component={AuthScreen} />
      <Tab.Screen name="Login" component={Login} />
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
