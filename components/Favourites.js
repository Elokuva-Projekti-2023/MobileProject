import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, React, useCallback } from 'react';
import { FlatList, StyleSheet, Text, View, ActivityIndicator, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function Favourites() {
  const [favoritesList, setFavoritesList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState('');

  const navigate = useNavigation();

  const retrieveToken = async () => {
    try {
      console.log('Retrieving token...');
      const token = await AsyncStorage.getItem('token');
      console.log('Retrieved token:', token);
      return token;
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  };

  const retrieveUserId= async () => {
    try {
      console.log('Retrieving userID...');
      const userId = await AsyncStorage.getItem('userId');
      const userName = await AsyncStorage.getItem('userName');
      console.log('Retrieved userID:', userId);
      setCurrentUser(userName);
      return userId;
    } catch (error) {
      console.error('Error retrieving id:', error);
      return null;
    }
  };

  const verifyUser = async () => {
    console.log('Verifying user...');
    const token = await retrieveToken();
    console.log('Retrieved token:', token);
    const userId = await retrieveUserId();
  
    if (token) {
      try {
        const response = await fetch(`http://192.168.***.**:8080/movielists/${userId}/movie-lists`, {
          headers: {

            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          const data = await response.json();
  
          if (data.favoritesList) {
            const favorites = data.favoritesList.movies || [];
  
            if (favorites.length === 0) {
              // Handle case where favorites list is empty
              setError('Favorites list is empty.');
            } else {
              setFavoritesList(favorites);
            } 
          } else {
            setError('Invalid response format: favoritesList not found.');
          }
        } else {
          setError(`Error: ${response.status}`);
        }
      } catch (error) {
        console.error('Error verifying user:', error);
        setError('An error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    } else {
      // Token is not available, handle this case (e.g., redirect to login screen)
      navigate.navigate('Login');
    }
  };

  useEffect(() => {
    verifyUser();
  }, []);
  

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text>Logged in as: {currentUser}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text>Error: {error}</Text>
      ) : (
        <FlatList
          data={favoritesList}
          keyExtractor={(item) => item.id.toString()} // Assuming id is a unique identifier
          numColumns={3}
          contentContainerStyle={styles.flatListContainer}
          renderItem={({ item }) => (
            <View key={item.id}>
              <Image
                style={styles.image}
                source={
                  item.poster_path
                    ? { uri: `https://image.tmdb.org/t/p/original/${item.poster_path}` }
                    : require('../poster_placeholder.png')
                }
              />
              <Text>{item.title}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  SearchBarContainer:{
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  searchBar: {
    flex: 1, // Aseta flex: 1
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

