import React, {useEffect} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import dynamicLinks, {
  FirebaseDynamicLinksTypes,
} from '@react-native-firebase/dynamic-links';

const App = () => {
  const handleDynamicLink = (link: FirebaseDynamicLinksTypes.DynamicLink) => {
    Alert.alert(`Before link : ${link.url}`);
    // Handle dynamic link inside your own application
    console.log(link, 'this is dynamic link');
    if (link.url === 'https://deeeplinktestvdv.page.link/bjYi') {
      Alert.alert(`Opened this dynamic link ${link.url}`);
    }
  };

  useEffect(() => {
    // const unsubscribe =
    dynamicLinks().onLink(handleDynamicLink);
    // const v = dynamicLinks().buildLink()
    console.log('Use effect registered ? !');

    setTimeout(() => {
      Alert.alert(
        'Dynamic link detected -> https://deeeplinktestvdv.page.link/bjYi',
      );
    }, 5000);

    // (async () => {
    //   const newUrl = await dynamicLinks().buildShortLink({
    //     link: 'https://reelweb.com/',
    //     domainUriPrefix: 'https://deeeplinktestvdv.page.link',
    //     android: {
    //       packageName: 'com.deeplinktest',
    //       fallbackUrl: 'https://facebook.com',
    //     },
    //     navigation: {
    //       forcedRedirectEnabled: true,
    //     },
    //   });

    //   console.log(newUrl, 'new url created');
    // })();

    // When the component is unmounted, remove the listener
    // return () => unsubscribe();
  }, []);

  return (
    <View style={styles.centerView}>
      <Text>This will show the dynamic link setup !</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  centerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
