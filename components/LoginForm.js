import React, { useState, route } from "react";
import { TextInput, View, StyleSheet, TouchableOpacity, Text } from "react-native";

export default function LoginForm({ navigation, route }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUserToken } = route.params;

    // TODO Login logic



    return (
      <View style={styles.container}>
        <View style={styles.inputView}>
            <TextInput
                style={styles.TextInput}
                placeholder="Email"
                placeholderTextColor="#003f5c"
                onChange={(email) => setEmail(email)}
            />
        </View>

        <View style={styles.inputView}>
            <TextInput
                style={styles.TextInput}
                placeholder="Password"
                placeholderTextColor="#003f5c"
                secureTextEntry={true}
                onChange={(password) => setPassword(password)}
            />
        </View>

        <TouchableOpacity 
            style={styles.loginBtn}
            onPress={ () => setUserToken('token')}
        >
            <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>

      </View>
    );
}

const styles = StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
    image: {
      marginBottom: 40,
    },
    inputView: {
      backgroundColor: "#3880ff",
      borderRadius: 30,
      width: "70%",
      height: 45,
      marginBottom: 20,
      alignItems: "center",
    },
    TextInput: {
      height: 50,
      flex: 1,
      padding: 10,
      marginLeft: 20,
    },
    forgot_button: {
      height: 30,
      marginBottom: 30,
    },
    loginBtn: {
      width: "80%",
      borderRadius: 25,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 40,
      backgroundColor: "#FF1493",
    },
  
  });
  