import { TextInput, Button, FlatList, StyleSheet, View, StatusBar, Text, Image, TouchableOpacity } from 'react-native';
import {useState, useEffect} from 'react';
import Popup from './Popup';
import { encode as base64 } from 'base-64'; // Import the base-64 library
import _ from 'lodash';


export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

    
  const fetchSearchedMovies = () => {
    // Replace 'YOUR_USERNAME' and 'YOUR_PASSWORD' with your actual credentials
    const username = 'usernameAnna';
    const password = 'password';
  
    // Encode credentials as Base64
    const base64Credentials = base64(`${username}:${password}`);

    fetch(`http://192.168.***.**:8080/api/tmdb/search/movie?searchTerm=${searchTerm}`, 
    {
      headers: {
        Authorization: `Basic ${base64Credentials}`,
        // Other headers if required
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setMovies(data);
      } else {
        console.log('API response is missing results property or the results array is empty: []');
        // Display a message to the user indicating that no results were found.
      }
    })
    
    
    .catch(err => {
      console.error('Error fetching or parsing movies:', err);
      // Display a message to the user about the network error
    });
  };

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
  
  const delayedFetch = _.debounce(fetchSearchedMovies, 10); 

  useEffect(() => {
    delayedFetch(); 
    return delayedFetch.cancel; 
  }, [searchTerm]);


  const calculateMargin = (title, originalTitle) => {
    const combinedTitle = title !== originalTitle ? `${title} (${originalTitle})` : title;
    const lineBreaks = combinedTitle.split('\n').length; // Tarkista rivinvaihdot
  
    // Tee arvio rivien määrästä perustuen rivinvaihtojen määrään
    if (lineBreaks > 3) {
      return 4;
    } else if (lineBreaks > 2) {
      return 3;
    } else if (lineBreaks > 1) {
      return 2; // Arvioitu kahdelle riville
    }
    return 1; // Arvioitu yhdelle riville
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
      {searchTerm.length > 0 && (
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item, index}) =>(
          <View style={[styles.movieContainer, index === 0 && styles.firstMovie]}>
            <TouchableOpacity onPress={() => openPopup(item)}>
            <Image style={[
              styles.image,
              {
                top: searchTerm.length > 0 ? (calculateMargin(item.title, item.original_title) 
                    === 1 ? 10 : calculateMargin(item.title, item.original_title) 
                    === 2 ? 15 : calculateMargin(item.title, item.original_title) 
                    === 3 ? 20 : 25) : 0,
              },
            ]}
              source={
                item.poster_path
                ? { uri: `https://image.tmdb.org/t/p/original/${item.poster_path}`}
                : require ('../poster_placeholder.png')
              }
            />
              <Text
                style={[
                  styles.movie_title,
                  {
                    bottom: searchTerm.length > 0 ? (calculateMargin(item.title, item.original_title) 
                    === 1 ? 30 : calculateMargin(item.title, item.original_title) 
                    === 2 ? 35 : calculateMargin(item.title, item.original_title) 
                    === 3 ? 40 : 45) : 0,
                  },
                ]}
              >
              {item.title !== item.original_title
                ? `${item.title} (${item.original_title})` //kun origin_title ja title ei ole sama, näkyy original_title (title)
                : item.title} 
              </Text>
            </TouchableOpacity>
          </View>
      
        )}
      />
      )}

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
        padding: 2,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 3,
        borderWidth: 1
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
        backgroundColor: 'lightgray',
        borderColor: 'gray',
        borderWidth: 0.4,
    },
    movie_title:{
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft: 15,
        marginRight: 50,
        left: 45,
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