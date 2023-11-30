import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';


const AuthScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async () => {
    if (!userName || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://192.168.100.19:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName,
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      // Additional actions after successful registration and sign-in
      console.log('User registered and signed in:', userCredential.user);
      navigation('Home'); // Navigate to the home screen
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Registration failed');
      console.error('Error during registration:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Registration Form</Text>
      <TextInput
        placeholder="Username"
        value={userName}
        onChangeText={(text) => setUserName(text)}
        style={styles.input}
      />
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
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
        secureTextEntry
        style={styles.input}
      />
      {loading ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.textInput}>Register</Text>
        </TouchableOpacity>
      )}
      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
         <Text style={styles.textInput}>Go Back to</Text>
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
    alignItems: "center",
    justifyContent: "center",
    margin:5,
    backgroundColor: "#FF1493",
  },
  textInput: {
    color: 'white'
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default AuthScreen;