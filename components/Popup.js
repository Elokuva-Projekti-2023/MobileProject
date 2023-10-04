import React from 'react';
import {StyleSheet, View, Modal, Text, Image, TouchableOpacity } from 'react-native';

export default function Popup({ visible, movie, onClose }) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
        <Image style={styles.image}source={{ uri: `https://image.tmdb.org/t/p/original/${movie.poster_path}`}}/>
          <Text>
            {movie.original_title !== movie.title
              ? `${movie.original_title} (${movie.title})` //kun origin_title ja title ei ole sama, näkyy original_title (title)
              : movie.original_title}  
          </Text>
          <Text>{movie.release_date}</Text>
          <Text>{movie.overview}</Text>
        </View>
      </View>
    </Modal>
  );

}
const styles = StyleSheet.create({
    image: {
      width: 113,
      height: 170,
      borderRadius: 5,
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
  });
  
