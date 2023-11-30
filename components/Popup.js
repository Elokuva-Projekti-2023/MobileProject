import React, { useEffect, useState } from 'react';
import {StyleSheet, View, Modal, Text, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { Button } from '@rneui/themed';
import { Icon } from '@rneui/base';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Popup({ visible, movie, onClose }) {
  // Add to favorites
  // Veryfy user and make request
  const retrieveUserId= async () => {
    try {
      console.log('Retrieving userID...');
      const userId = await AsyncStorage.getItem('userId');
      console.log('Retrieved userID:', userId);
      return userId;
    } catch (error) {
      console.error('Error retrieving id:', error);
      return null;
    }
  };

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

   const movies ={
    movie_id: movie.id,
    title: movie.title,
    overview: movie.overview,
    genre_ids: movie.genre_ids,
    poster_path: movie.poster_path,
    original_title: movie.original_title,
    release_date: movie.release_date,
    vote_average: movie.vote_average,
    vote_count: movie.vote_count}

    const [favoriteMovies, setFavoriteMovies] = useState([]);
    const [watchedMovies, setWatchedMovies] = useState([]);
    const [watchLaterMovies, setWatchLaterMovies] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isWatchLater, setIsWatchLater] = useState(false);
    const [isWatched, setIsWatched] = useState(false);
    const [favoriteColor, setFavoriteColor] = useState('rgba(100, 100, 100, 0.96)');
    const [watchLaterColor, setWatchLaterColor] = useState('rgba(100, 100, 100, 0.96)');
    const [watchedColor, setWatchedColor] = useState('rgba(100, 100, 100, 0.96)');

    const saveMovieState = async (key, value) => {
      try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('Error saving movie state:', error);
      }
    };
    
    // Funktio elokuvan tilan hakemiseen paikallisesti
    const getMovieState = async (key) => {
      try {
        const value = await AsyncStorage.getItem(key);
        return value ? JSON.parse(value) : null;
      } catch (error) {
        console.error('Error getting movie state:', error);
        return null;
      }
    };
  
    useEffect(() => {
      const checkFavorite = async () => {
        const storedFavoriteMovies = await getMovieState('favoriteMovies');
        if (storedFavoriteMovies && storedFavoriteMovies.some((favoriteMovie) => favoriteMovie.id === movie.id)) {
          setFavoriteColor('rgb(255, 215, 0)');
          setIsFavorite(true);
        }
      };
  
      const checkWatchLater = async () => {
        const storedWatchLaterMovies = await getMovieState('watchLaterMovies');
        if (storedWatchLaterMovies && storedWatchLaterMovies.some((watchLaterMovie) => watchLaterMovie.id === movie.id)) {
          setWatchLaterColor('rgb(255, 105, 180)');
          setIsWatchLater(true);
        }
      };
  
      const checkWatched = async () => {
        const storedWatchedMovies = await getMovieState('watchedMovies');
        if (storedWatchedMovies && storedWatchedMovies.some((watchedMovie) => watchedMovie.id === movie.id)) {
          setWatchedColor('rgb(148, 0, 211)');
          setIsWatched(true);
        }
      };
  
      checkFavorite();
      checkWatchLater();
      checkWatched();
    }, [movie.id]);
  
    const addToFavorites = async() => {
      const token = await retrieveToken();
      const userId = await retrieveUserId();

    if (favoriteMovies.some((favoriteMovie) => favoriteMovie.id === movie.id)) {
      alert(`${movie.title} is already in your favorites`);
      return;
    }

    try {  
      const response = await fetch(`http://192.168.100.19:8080/movielists/${userId}/add-movie-to-favorites/${movie.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include authorization header
        },
        body: JSON.stringify({ movies }),
        mode: 'cors', // Place mode outside the headers
      });
  
      if (response.ok) {
        const updatedFavoriteMovies = [...favoriteMovies, movie];
        setFavoriteMovies(updatedFavoriteMovies); // Päivitä tila ensin
  
        await saveMovieState('favoriteMovies', updatedFavoriteMovies);
        setIsFavorite(true);
        setFavoriteColor('rgb(255, 215, 0)');
        console.log(`Movie with ID ${movie.id} added to favorites successfully`);

      } else {
        const errorData = await response.json();
        console.error('Error adding movie to favorites', errorData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addToWatchLater = async() => {
    const token = await retrieveToken();
    const userId = await retrieveUserId();
    if (watchLaterMovies.some((watchLaterMovie) => watchLaterMovie.id === movie.id)) {
      alert(`${movie.title} is already in your watch later list`);
      return;
    }

    try {  
      const response = await fetch(`http://192.168.100.19:8080/movielists/${userId}/add-movie-to-about-to-watch/${movie.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include authorization header
        },
        body: JSON.stringify({movies}),
        mode: 'cors'
      });
  
      if (response.ok) {
        const updatedWatchLaterMovies = [...watchLaterMovies, movie];
        setWatchLaterMovies(updatedWatchLaterMovies); // Päivitä tila ensin
  
        await saveMovieState('watchLaterMovies', updatedWatchLaterMovies);
        setIsWatchLater(true);
        setWatchLaterColor('rgb(255, 105, 180)');
        console.log(`Movie with ID ${movie.id} added to watch later successfully`);

      } else {
        const errorData = await response.json();
        console.error('Error adding movie to watch later', errorData);
      }
    } catch (err) {
      console.error(err);
    }
  };
  

  const addToWatched = async() => {
    const token = await retrieveToken();
    const userId = await retrieveUserId();
    if (watchedMovies.some((watchedMovie) => watchedMovie.id === movie.id)) {
      alert(`${movie.title} is already in your watched list`);
      return;
    }
    try {  
      const response = await fetch(`http://192.168.100.19:8080/movielists/${userId}/add-movie-to-watched/${movie.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include authorization header
        },
        body: JSON.stringify({movies}),
        mode: 'cors'
      });
  
      if (response.ok) {
        const updatedWatchedMovies = [...watchedMovies, movie];
        setWatchedMovies(updatedWatchedMovies); // Päivitä tila ensin
  
        await saveMovieState('watchedMovies', updatedWatchedMovies);
        setIsWatched(true); 
        setWatchedColor('rgb(148, 0, 211)');
        console.log(`Movie with ID ${movie.id} added to watched successfully`);

      } else {
        const errorData = await response.json();
        console.error('Error adding movie to watched', errorData);
      }
    } catch (err) {
      console.error(err);
    }
  };
  
  
  useEffect(() => {
    const fetchMovieStates = async () => {
      const favoriteMoviesState = await getMovieState('favoriteMovies');
      const watchLaterMoviesState = await getMovieState('watchLaterMovies');
      const watchedMoviesState = await getMovieState('watchedMovies');
  
      if (favoriteMoviesState) {
        setFavoriteMovies(favoriteMoviesState);
      }
  
      if (watchLaterMoviesState) {
        setWatchLaterMovies(watchLaterMoviesState);
      }
  
      if (watchedMoviesState) {
        setWatchedMovies(watchedMoviesState);
      }
    };
  
    fetchMovieStates();
  }, []);
  

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      
    >
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.popupContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name='close'type='material-icons' color="white"/>
          </TouchableOpacity>
          <Image style={styles.image}
          source={
            movie.poster_path
            ? { uri: `https://image.tmdb.org/t/p/original/${movie.poster_path}`}
            : require ('../poster_placeholder.png')
          }
            />
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>{movie.vote_average.toFixed(1)}</Text>
          </View>
          <Text style={styles.title_text}>
            {movie.title !== movie.original_title
              ? `${movie.title} (${movie.original_title})` //kun origin_title ja title ei ole sama, näkyy title (original_title)
              : movie.title}  
          </Text>

          <View style={styles.buttons}>
            <View style={{ alignItems: 'center', marginRight: 10}}>
              <Button onPress={() => addToFavorites(movie.movieId)} radius={'xl'} color={favoriteColor}>
                <Icon name='star'type='font-awesome' color="white"/>
              </Button>
              <Text style={{ color: 'white', fontSize: 9}}>Save</Text>
            </View>

          <View style={{ alignItems: 'center', marginRight: 10 }}>
            <Button onPress={addToWatchLater} radius={'xl'} color={watchLaterColor}>
              <Icon name='watch-later'type='material-icons' color="white"/>          
            </Button>
            <Text style={{ color: 'white', fontSize: 9}}>Watch later</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Button onPress={addToWatched} radius={'xl'} color={watchedColor}>
              <Icon name='check'type='font-awesome' color="white"/>
            </Button>
            <Text style={{ color: 'white', fontSize: 9}}>Seen</Text>
          </View>
          </View>

          <ScrollView style={styles.overviewContainer}>
          <Text style={{ color: 'white', marginBottom: 10}}>Release Date: {movie.release_date}</Text>
          <Text style={{ color: 'white'}}>{movie.overview}</Text>
          <Text style={{ color: 'white'}}>{movie.id}</Text>

          </ScrollView>
        </View>
      </View>
    </Modal>
  );

}

const styles = StyleSheet.create({
    popupContainer: {
      backgroundColor: 'rgba(40, 40, 40, 0.96)',
      padding: 20,
      borderRadius: 10,
      height: Dimensions.get('window').height *0.84, // Koko näytön korkeuden mukaan, voit säätää tarvittaessa
      width: Dimensions.get('window').width,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: 113,
      height: 170,
      borderRadius: 5,
      position: 'absolute', // Lisätty kuvan sijainnin määrittely
      top: 50, // Siirretään yläkulmaan
      left: 15, // Siirretään vasempaan kulmaan
    },
    closeButton: {
      position: 'absolute',
      top: 10,
      left: 10,
      backgroundColor: 'transparent',
      zIndex: 1,
    },
    title_text: {
      fontSize: 20,
      fontWeight: 'bold',
      position: 'absolute',
      top: 50,
      left: Dimensions.get('window').width * 0.4,
      maxWidth: Dimensions.get('window').width / 2, // Maksimileveys puoleenväliin näyttöä
      height: Dimensions.get('window').height / 2,
      color: 'white',
    },
    ratingContainer: {
      backgroundColor: 'yellow',
      borderRadius: 100, 
      width: 50, 
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: 190, 
      left: 100,
    },
    rating: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    buttons: {
      flexDirection: 'row',
      marginBottom: 40,
      top: 250,
      position: 'absolute',

    },
    overviewContainer: {
      padding: 20,
      top: 300,
      borderRadius: 10,
      marginBottom: 20,
      position: 'absolute',
      maxHeight: Dimensions.get('window').height * 0.4, // Lisätty maxHeight-rajoitus
    },
  });
  
