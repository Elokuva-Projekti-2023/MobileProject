import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, React, useCallback } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Popup from './Popup.js';


export default function Profile() {
  const [onWatchList, setOnWatchList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);


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
  
          if (data.onWatchList) {
            const watched = data.onWatchList.movies || [];
  
            if (watched.length === 0) {
              // Handle case where favorites list is empty
              setError('Watched list is empty.');
            } else {
                const reversedList = watched.reverse();
              setOnWatchList(reversedList);
            } 
          } else {
            setError('Invalid response format: watchedList not found.');
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
  
  const openPopup = (movie) => {
    setSelectedMovie(movie);
  };

  // Funktio sulkee popup-ikkunan
  const closePopup = () => {
    setSelectedMovie(null);
  };


  useEffect(() => {
    if (onWatchList.length < 3 && !loading && !error) {
      // Lisää tyhjiä objekteja, jotta saadaan täytettyä kolme korttia
      const emptyMoviesCount = 3 - onWatchList.length;
      const emptyMovies = Array.from({ length: emptyMoviesCount }, () => ({}));
      setOnWatchList([...emptyMovies, ...onWatchList]);
    }
  }, [onWatchList, loading, error]);
  
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text>Error: {error}</Text>
        
      ) : (
        <View>
        <FlatList
          data={onWatchList}
          keyExtractor={(item) => item.id} // Assuming id is a unique identifier
          numColumns={3}
          contentContainerStyle={styles.flatListContainer}
          ListHeaderComponent={
            <View style={styles.profile}>
              <Image source={ require('../ProfilePicturePlaceholder.png') } style={styles.profileImage} />
              <Text style={styles.profileText}>{currentUser}</Text>
              <Text style={styles.headline}>Watched Movies</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View key={item.id} style={styles.itemContainer}>
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
              ? `${item.title} (${item.original_title})` //kun origin_title ja title ei ole sama, näkyy original_title (title)
              : item.title}
              </Text> 
              </TouchableOpacity>

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
  headline: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10
  },
  profile: {
    marginTop: 15,
  },
  profileImage: {
    width: 100, 
    height: 100, 
    marginBottom:20,
    alignSelf: 'center'
  },
  profileText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

