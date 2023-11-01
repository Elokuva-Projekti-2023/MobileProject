import React, { useState, route, useContext } from "react";
import { TextInput, View, StyleSheet, TouchableOpacity, Text } from "react-native";
import AuthContext from '../App';

export default function LoginForm() {
    const [userName, setUserName] = useState('');
    const [loginpwd, setLoginpwd] = useState('');
    //const { setUserToken } = route.params;
    const { signIn } = useContext(AuthContext);

    return (
      <View style={styles.container}>
        <View style={styles.inputView}>
            <TextInput
                style={styles.TextInput}
                placeholder="UserName"
                placeholderTextColor="#003f5c"
                value={userName}
                onChangeText={setUserName}
            />
        </View>

        <View style={styles.inputView}>
            <TextInput
                style={styles.TextInput}
                placeholder="Password"
                placeholderTextColor="#003f5c"
                value={loginpwd}
                secureTextEntry={true}
                onChangeText={setLoginpwd}
            />
        </View>

        <TouchableOpacity 
            style={styles.loginBtn}
            onPress={ () => signIn({ userName, loginpwd })}
        >
            <Text style={styles.loginText}>Sign in</Text>
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
  