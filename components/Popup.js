import React from 'react';
import {StyleSheet, View, Modal, Text, Image, TouchableOpacity, Dimensions } from 'react-native';

export default function Popup({ visible, movie, onClose }) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.popupContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>x</Text>
        </TouchableOpacity>
        <Image style={styles.image}source={{ uri: `https://image.tmdb.org/t/p/original/${movie.poster_path}`}}/>
        <View style={styles.ratingContainer}>
            <Text style={styles.rating}>{movie.vote_average.toFixed(1)}</Text>
          </View>
          <Text style={styles.title_text}>
            {movie.original_title !== movie.title
              ? `${movie.original_title} (${movie.title})` //kun origin_title ja title ei ole sama, näkyy original_title (title)
              : movie.original_title}  
          </Text>
          <Text>Release Date: {movie.release_date}</Text>
          <Text>{movie.overview}</Text>
        </View>
      </View>
    </Modal>
  );

}
const styles = StyleSheet.create({
    popupContainer: {
      backgroundColor: 'rgba(128, 128, 128, 0.96)',
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
    closeButtonText: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    title_text: {
      fontSize: 20,
      fontWeight: 'bold',
      position: 'absolute',
      top: 50,
      left: Dimensions.get('window').width * 0.4,
      maxWidth: Dimensions.get('window').width / 2, // Maksimileveys puoleenväliin näyttöä
      height: Dimensions.get('window').height / 2,
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
  });
  
