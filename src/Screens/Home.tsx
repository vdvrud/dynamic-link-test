import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import dynamicLinks, {
  FirebaseDynamicLinksTypes,
} from '@react-native-firebase/dynamic-links';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import {NavigationScreens} from '../common';

enum TokenStorageOperation {
  Set = 'set',
  Unset = 'unset',
}

const HomeComponent: React.FC<any> = ({navigation}) => {
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

  const navigateUser = () => {
    setTimeout(() => {
      if (authenticated.current) {
        navigation.navigate(NavigationScreens.Next);
      }
      if (!authenticated.current) {
        navigation.navigate(NavigationScreens.Login);
      }
    }, 1000);
  };

  // Handle dynamic link inside your own application
  const handleDynamicLink = (link: FirebaseDynamicLinksTypes.DynamicLink) => {
    console.log(link, 'this is dynamic link');
    if (link.url === 'https://google.com') {
      navigateUser();
    }
  };

  // const buildLink = async () => {
  //   const link = await dynamicLinks().buildLink({
  //     link: 'https://deeplinktest.psegtest.io',
  //     // domainUriPrefix is created in your Firebase console
  //     domainUriPrefix: 'https://deeeplinktestvdv.page.link',
  //     // optional setup which updates Firebase analytics campaign
  //     // "banner". This also needs setting up before hand
  //     analytics: {
  //       campaign: 'psegtest',
  //     },
  //   });

  //   console.log(link, 'built link');
  //   return link;
  // };

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);

    dynamicLinks()
      .getInitialLink()
      .then(link => {
        if (link?.url === 'https://google.com') {
          navigateUser();
        }
      });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <Text style={styles.textWhite}>Log Out</Text>
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

export {HomeComponent};
