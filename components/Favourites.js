import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, ActivityIndicator, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function Favourites() {
  const [favoritesList, setFavoritesList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const favoritesUrl = `http://192.168.255.52:8080/movielists/1/movie-lists`;

  const navigate = useNavigation();

  const retrieveToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      return token;
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  };

  const verifyUser = async () => {
    const token = await retrieveToken();
  
    if (token) {
      try {
        const response = await fetch('http://example.com/api/some_endpoint', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          // other request options...
        });
  
        // Handle the response as needed
        // ...
      } catch (error) {
        console.error('Error verifying user:', error);
      }
    } else {
      // Token is not available, handle this case (e.g., redirect to login screen)

    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(favoritesUrl, {
          headers: {
            Authorization: `Basic ${base64Credentials}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        setFavoritesList(result.favoritesList.movies); // Accessing movies directly
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [base64Credentials, favoritesUrl]);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

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

