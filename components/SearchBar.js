import { TextInput, Button, FlatList, StyleSheet, View, StatusBar, Text, Image, TouchableOpacity } from 'react-native';
import {useState} from 'react';
import Popup from './Popup';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

    
  const fetchSearchedMovies = () => {
    fetch(`https://api.themoviedb.org/3/search/movie?query=${searchTerm}&api_key=${process.env.EXPO_PUBLIC_API_KEY}`)
    .then(response => response.json())
    .then(data => setMovies(data.results))
    .catch(err => console.error(err))
  }

     // Funktio avaa popup-ikkunan valitulle elokuvalle
  const openPopup = (movie) => {
    setSelectedMovie(movie);
  };
    
  // Funktio sulkee popup-ikkunan
  const closePopup = () => {
    setSelectedMovie(null);
  };
      
  const handleCancel = () => {
    setSearchTerm('');
    setMovies([]); // Tyhjennä myös elokuvien lista
  };
  
  return (
    <View>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Search a movie.."
          value={searchTerm}
          onChangeText={text => {
            setSearchTerm(text);
            fetchSearchedMovies();
          }}
        />
          {searchTerm.length > 0 && ( // Tarkista, onko hakukenttä tyhjä vai ei
            <TouchableOpacity onPress={handleCancel} style={styles.transparentButton}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          )}
      </View>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item, index}) =>(
          <View style={[styles.movieContainer, index === 0 && styles.firstMovie]}>
            <TouchableOpacity onPress={() => openPopup(item)}>
              <Image style={styles.image}source={{ uri: `https://image.tmdb.org/t/p/original/${item.poster_path}`}}/>
              <Text style={styles.movie_title}>
              {item.original_title !== item.title
                ? `${item.original_title} (${item.title})` //kun origin_title ja title ei ole sama, näkyy original_title (title)
                : item.original_title} 
              </Text>
            </TouchableOpacity>
          </View>
      
        )}
      />

      {selectedMovie && (
        <Popup visible={true} movie={selectedMovie} onClose={closePopup} />
      )} 
      <StatusBar style="auto" />
    </View>
  );
}


const styles = StyleSheet.create({
    searchBar: {
        position: 'absolute',
        top: 0, // Kiinnitä yläreunaan
        left: 0, // Voit käyttää myös 'right' ja 'bottom' tarpeen mukaan
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        zIndex: 1, // Varmista, että searchbar on muiden elementtien päällä
        paddingLeft: 10, // Lisää marginaali vasemmalle sivulle
      },
    input: {
      flex: 1, // Take up remaining space
    },
    image: {
        width: 38,
        height: 57,
        borderRadius: 5,
        marginLeft: 10,
      },
    movieContainer:{
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255, 0.5)',
        borderColor: 'gray',
        borderWidth: 1,
        
    },
    movie_title:{
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft: 15,
        
    },
    firstMovie: {
      marginTop: 37, // Lisää ylimääräinen tila ensimmäisen elokuvan yläpuolelle hakupalkin koko
    },
    transparentButton: {
      backgroundColor: 'transparent',
      paddingRight: 10
    },
    buttonText: {
      fontSize: 15,
      fontWeight: 'bold'
    },
  });