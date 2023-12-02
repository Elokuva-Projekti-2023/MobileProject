import { StatusBar } from 'expo-status-bar';
import React,{ useEffect, useState, useCallback } from 'react';
import { FlatList, StyleSheet, Text, View, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Popup from './Popup.js';


export default function AboutToWatch() {
  const [aboutToWatchList, setAboutToWatchList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);


  const navigate = useNavigation();

  const navigateToProfile = () => {
    navigate.navigate('Profile'); 
  };

  React.useLayoutEffect(() => {
    navigate.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={navigateToProfile} style={{ marginRight: 20 }}>
          <Text style={{ color: 'black' }}>Profiili</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigate, navigateToProfile]);

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
  
          if (data.aboutToWatchList) {
            const aboutToWatch = data.aboutToWatchList.movies || [];
  
            if (aboutToWatch.length === 0) {
              // Handle case where about to watch list is empty
              setError('About to watch list is empty');
            } else {
              setAboutToWatchList(aboutToWatch);
            } 
          } else {
            setError('Invalid response format: aboutToWatchList not found.');
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
  
  // Function opens popup for the selected movie
  const openPopup = (movie) => {
    setSelectedMovie(movie);
  };

  // Function closes popup
  const closePopup = () => {
    setSelectedMovie(null);
  };


  useEffect(() => {
    if (aboutToWatchList.length < 3 && !loading && !error) {
      // Adds empty objects to get movie mockups
      const emptyMoviesCount = 3 - aboutToWatchList.length;
      const emptyMovies = Array.from({ length: emptyMoviesCount }, () => ({}));
      setAboutToWatchList([...aboutToWatchList, ...emptyMovies]);
    }
  }, [aboutToWatchList, loading, error]);

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
          data={aboutToWatchList}
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

