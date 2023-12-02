import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, StyleSheet, Text, View, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Popup from './Popup.js';
import Ionicons from '@expo/vector-icons/Ionicons';


export default function Favourites() {
  const [favoritesList, setFavoritesList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);

  
  const navigation = useNavigation();

  const navigateToProfile = () => {
    navigation.navigate('Profile');
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={navigateToProfile} style={{ marginRight: 20 }}>
          <Ionicons name={ 'person' } size={30}/>
        </TouchableOpacity>
      ),
    });
  }, [navigation, navigateToProfile]);

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
        const response = await fetch(`http://192.168.***.***:8080/movielists/${userId}/movie-lists`, {
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
              setError('Favorites list is empty');
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
      navigation.navigate('Login');
    }
  };

  useEffect(() => {
    verifyUser();
  }, []);
  
 // Function opens popup for the selected movie
  const openPopup = (movie) => {
    setSelectedMovie(movie);
  };

  // Function closes popup
  const closePopup = () => {
    setSelectedMovie(null);
  };


  useEffect(() => {
    if (favoritesList.length < 3 && !loading && !error) {
      // Adds empty objects to get movie mockups
      const emptyMoviesCount = 3 - favoritesList.length;
      const emptyMovies = Array.from({ length: emptyMoviesCount }, () => ({}));
      setFavoritesList([...favoritesList, ...emptyMovies]);
    }
  }, [favoritesList, loading, error]);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text>{error}</Text>
      ) : (
        <View>
        <FlatList
          data={favoritesList}
          keyExtractor={(item) => item.id} // Assuming id is a unique identifier
          numColumns={3}
          contentContainerStyle={styles.flatListContainer}
          renderItem={({ item }) => (
            <View key={item.id} style={styles.itemContainer}>
                  {(item.poster_path && item.poster_path !== null) ? (
              <TouchableOpacity onPress={() => openPopup(item)}>
              <Image
                style={styles.image}
                source={
                  item.poster_path
                    ? { uri: `https://image.tmdb.org/t/p/original/${item.poster_path}` }
                    : require('../poster_placeholder.png')
                }
              />
              <Text style={styles.text} numberOfLines={2} ellipsizeMode="tail">
              {item.title !== item.original_title
              ? `${item.title} (${item.original_title})` // when origin_title and title are not the same, it shows as "title (original_title)"
              : item.title}
              </Text> 
              </TouchableOpacity>
              ) : (
                // Shows the empty objects as invisible and unpressable
                <View style={{ width: 113, height: 170 }} />
              )}
              </View>
          )}
          
        />
        </View>

      )}

    {selectedMovie && (
            <Popup visible={true} movie={selectedMovie} onClose={closePopup} />
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
    flex: 1, 
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

