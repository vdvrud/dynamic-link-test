import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  AppState,
  TouchableOpacity,
} from 'react-native';
import dynamicLinks, {
  FirebaseDynamicLinksTypes,
} from '@react-native-firebase/dynamic-links';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

enum TokenStorageOperation {
  Set = 'set',
  Unset = 'unset',
}

const App = () => {
  const appState = useRef(AppState.currentState);
  const [, setAppStateVisible] = useState(appState.current);

  const authenticated = useRef<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState(authenticated.current);

  const handleTokenStorage = async (operation: TokenStorageOperation) => {
    if (operation === TokenStorageOperation.Set) {
      await AsyncStorage.setItem('token', uuid.v4() as string);
      authenticated.current = true;
      setIsAuthenticated(true);
    }

    if (operation === TokenStorageOperation.Unset) {
      await AsyncStorage.removeItem('token');
      authenticated.current = false;
      setIsAuthenticated(false);
    }
  };

  const handleDynamicLink = (link: FirebaseDynamicLinksTypes.DynamicLink) => {
    // Handle dynamic link inside your own application
    console.log(link, 'this is dynamic link');
    if (link.url === 'https://deeeplinktestvdv.page.link/bjYi') {
      Alert.alert(`Opened this dynamic link ${link.url}`);
    }
  };

  useEffect(() => {
    dynamicLinks().onLink(handleDynamicLink);
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      // console.log(appStateVisible, 'appStateVisible', authenticated.current);
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
        Alert.alert(
          authenticated.current
            ? 'You are authenticated, will navigate to next screen !'
            : 'You are not authenticated, will navigate to login screen !',
        );
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      // console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={styles.centerView}>
      <Text>Dynamic Link Setup !</Text>
      <Text>{isAuthenticated ? 'Authenticated' : 'Un-Authenticated'}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleTokenStorage(TokenStorageOperation.Set)}>
        <Text style={styles.textWhite}>Authenticate</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleTokenStorage(TokenStorageOperation.Unset)}>
        <Text style={styles.textWhite}>De-Authenticate</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  centerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#43464b',
    borderRadius: 13,
    paddingVertical: 13,
    paddingHorizontal: 50,
    marginVertical: 10,
  },
  textWhite: {
    color: 'white',
    letterSpacing: 1,
    fontSize: 16,
  },
});

export default App;
