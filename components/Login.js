import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { TextInput, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmation, setConfirmation] = useState('');

  const navigate = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('All fields are required');
      return;
    }
    setLoading(true);
  
    try {
        const response = await fetch('http://192.168.***.**:8080/api/auth/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
      
        const data = await response.json();
      
        if (response.ok) {
          const token = data.sessionToken;
          const userId = data.userData.userId;
          const userName = data.userData.userName;
      
          if (token && userId) {
            // Clear movie lists data for the previous user
            await AsyncStorage.removeItem('favoriteMovies');
            await AsyncStorage.removeItem('watchLaterMovies');
            await AsyncStorage.removeItem('watchedMovies');

            // Store the token in AsyncStorage
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('userId', userId.toString());
            await AsyncStorage.setItem('userName', userName);
            // Optionally, you can set a confirmation message
            setConfirmation('Login successful!');
            console.log(token);
            console.log(userId);
            // Optionally, you can redirect the user to another page
            // history.push('/dashboard');
            //navigate.navigation('Favourites')
          } else {
            setError('Token or userId is undefined');
          }
        } else {
          setError('Login failed. Please check your credentials.');
        }
      } catch (error) {
        setLoading(false);
        setError('An error occurred while logging in.');
        console.error('Login failed:', error);
      } finally {
        setLoading(false);
      }

  };
  

  return (
    <View style={styles.container}>
      <Text>Login form</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        style={styles.input}
        secureTextEntry={true}
      />
      {loading ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : (
        <>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.textInput}>Login</Text>
          </TouchableOpacity>
          {error && <Text style={styles.error}>{error}</Text>}
        </>
      )}

      {confirmation && <Text style={styles.confirmation}>{confirmation}</Text>}

      <TouchableOpacity style={styles.button} onPress={() => navigate.navigate('Home')}>
        <Text style={styles.textInput}>to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    textAlign: 'center',
  },
  button: {
    width: 100,
    borderRadius: 10,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    backgroundColor: '#FF1493',
  },
  textInput: {
    color: 'white',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  confirmation: {
    color: 'green',
    marginTop: 10,
  },
});

export default Login;
