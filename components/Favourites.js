import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { encode as base64 } from 'base-64'; // Import the base-64 library

export default function Favourites() {
  const [favoritesList, setFavoritesList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const favoritesUrl = 'http://192.168.255.52:8080/movielists/allusers';

    // Replace 'YOUR_USERNAME' and 'YOUR_PASSWORD' with your actual credentials
    const username = 'usernameAnna';
    const password = 'password';
  
    const base64Credentials = base64(`${username}:${password}`); // Encode credentials as Base64

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(favoritesUrl, {
          headers: {
            Authorization: `Basic ${base64Credentials}`,
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        setFavoritesList(result);
      } catch (error) {
        setError(error.message); // Set a more descriptive error message
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Tämä sivu suosikeille!</Text>
      <StatusBar style="auto" />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text>Error: {error}</Text>
      ) : (
        <FlatList
          data={favoritesList}
          keyExtractor={(item) => (item.id ?? '').toString()} // Ensure key is a string
          numColumns={3}
          contentContainerStyle={styles.flatListContainer}
          renderItem={({ item }) => (
            <View key={item.id} style={styles.itemContainer}>
              <Text>{item.favoritesList.movies.title}</Text>
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

