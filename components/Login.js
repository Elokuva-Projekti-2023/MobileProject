import { View, Text, StyleSheet, TextInput, ActivityIndicator, Button, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [passwd, setPasswd] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const singIn = async () => {
    setLoading(true);
    try {
        const response = await signInWithEmailAndPassword(auth, email, passwd)
        console.log(response);
    } catch (error) {
        console.log(error);
        alert('Sign in failed: ' + error.message);
    } finally {
        setLoading(false);
    }
  }

  const singUp = async () => {
    setLoading(true);
    try {
        const response = await createUserWithEmailAndPassword(auth, email, passwd)
        console.log(response);
        alert('Check your emails!');
    } catch (error) {
        console.log(error);
        alert('Sign in failed: ' + error.message);
    } finally {
        setLoading(false);
    }
  }

  return (
    <View style={styles.loginContainer }>
        <KeyboardAvoidingView behavior='padding'>
            <TextInput style={styles.loginInput}
                value={email}
                placeholder='Email'
                autoCapitalize='none'
                onChangeText={(text) => setEmail(text)}>
            </TextInput>

            <TextInput style={styles.loginInput}
                secureTextEntry={true}
                value={passwd}
                placeholder='password'
                autoCapitalize='none'
                onChangeText={(text) => setPasswd(text)}>
            </TextInput>

            { loading ? (
                <ActivityIndicator size='large' color='#000f' />
            ) : (
            <>
                <Button style={styles.loginButton} title='Login' onPress={singIn} />
                <Button style={styles.loginButton} title='Create account' onPress={singUp} />
            </>
            )}
        </KeyboardAvoidingView>
    </View>
  )
}

export default Login;

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
    loginContainer: {
        marginHorizontal: 20,
        flex: 1,
        justifyContent: 'center'
    },
    loginInput: {
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff'
    },
    loginButton: {
        padding: 10
    }
  });