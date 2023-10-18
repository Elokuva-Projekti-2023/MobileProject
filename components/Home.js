import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import Popup from './Popup.js';
import { StyleSheet, View, FlatList, Image, Text, TouchableOpacity } from 'react-native';
import SearchBar from './SearchBar.js';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    fetch(process.env.EXPO_PUBLIC_API_URL + process.env.EXPO_PUBLIC_API_KEY)
    .then(response => response.json())
    .then(data => {
      //rajoittaa elokuvien määrän 18
      const limitedMovies = data.results.slice(0, 18);
        setMovies(limitedMovies);
      })
    .catch( err => console.error(err))
    }, []);

     // Funktio avaa popup-ikkunan valitulle elokuvalle
  const openPopup = (movie) => {
    setSelectedMovie(movie);
  };

  // Funktio sulkee popup-ikkunan
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
            <Image style={styles.image}source={{ uri: `https://image.tmdb.org/t/p/original/${item.poster_path}`}}/>
            <Text style={styles.text} numberOfLines={2} ellipsizeMode="tail">
              {item.original_title !== item.title
              ? `${item.original_title} (${item.title})` //kun origin_title ja title ei ole sama, näkyy original_title (title)
              : item.original_title}
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
