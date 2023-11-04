// AuthContext.js
import { createContext, useContext, useReducer, useMemo, state } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [state, dispatch] = React.useReducer(
        (prevState, action) => {
          switch (action.type) {
            case 'RESTORE_TOKEN':
              return {
                ...prevState,
                userToken: action.token,
                isLoading: false,
              };
            case 'SIGN_IN':
              return {
                ...prevState,
                isSignout: false,
                userToken: action.token,
              };
            case 'SIGN_OUT':
              return {
                ...prevState,
                isSignout: true,
                userToken: null,
              };
          }
        },
        {
          isLoading: true,
          isSignout: false,
          userToken: null,
        }
      );

      React.useEffect(() => {
        // Fetch the token from storage then navigate to our appropriate place
        const bootstrapAsync = async () => {
          let userToken;
    
          try {
            // Restore token stored in `SecureStore` or any other encrypted storage
            // userToken = await SecureStore.getItemAsync('userToken');
          } catch (e) {
            // Restoring token failed
          }
    
          // After restoring token, we may need to validate it in production apps
    
          // This will switch to the App screen or Auth screen and this loading
          // screen will be unmounted and thrown away.
          dispatch({ type: 'RESTORE_TOKEN', token: userToken });
        };
    
        bootstrapAsync();
      }, []);
    

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        // In a production app, you need to send some data (usually username, password) to a server and get a token
        // You will also need to handle errors if sign in fails
        // After getting the token, you need to persist it using `SecureStore` or any other encrypted storage
        // In the example, you can use a dummy token
  
        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async (data) => {
        // In a production app, you need to send user data to a server and get a token
        // You will also need to handle errors if sign up fails
        // After getting the token, you need to persist it using `SecureStore` or any other encrypted storage
        // In the example, you can use a dummy token
  
        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
