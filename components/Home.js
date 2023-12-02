import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import Popup from './Popup.js';
import { StyleSheet, View, FlatList, Image, Text, TouchableOpacity, Button } from 'react-native';
import SearchBar from './SearchBar.js';
import { useNavigation } from '@react-navigation/native';


export default function Home() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const navigation = useNavigation();

  // Use your actual API endpoint with your local network IP address
  const apiUrl ='http://192.168.***.**:8080/api/tmdb/now-playing';

  useEffect(() => {
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.length > 0) {
              setMovies(data);
          
        } else {
          console.warn('Empty response or unexpected data format.');
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);


     // Function opens popup for the selected movie
  const openPopup = (movie) => {
    setSelectedMovie(movie);
  };

  // Function closes popup
  const closePopup = () => {
    setSelectedMovie(null);
  };

  return (
    <View style={styles.SearchBarContainer}>
      <View style={styles.searchBar}>
      <SearchBar/>
    <View style={styles.container}>
      
      <FlatList
          data={movies}
          keyExtractor={item => item.id}
          numColumns={3} 
          contentContainerStyle={styles.flatListContainer}
          renderItem={({item}) =>  
          <View key={item.id} style={styles.itemContainer}>
            <TouchableOpacity onPress={() => openPopup(item)}>
            <Image style={styles.image}
              source={
                item.poster_path
                ? { uri: `https://image.tmdb.org/t/p/original/${item.poster_path}`}
                : require ('../poster_placeholder.png')
              }
            />
            <Text style={styles.text} numberOfLines={2} ellipsizeMode="tail">
              {item.title !== item.original_title
              ? `${item.title} (${item.original_title})` // when origin_title and title are not the same, it shows as "title (original_title)"
              : item.title}
              </Text> 
            </TouchableOpacity>
          </View>
        }
        />    
         </View>
         </View>
 
        {selectedMovie && (
        <Popup visible={true} movie={selectedMovie} onClose={closePopup} />
      )} 
      <StatusBar style="auto" />
    </View>
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
