import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, View } from 'react-native';

import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowAlert: true,
    };
  }
});

const allowsNotificationsAsync = async () => {
  const settings = await Notifications.getPermissionsAsync();
  return (
    settings.granted ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
};

const requestPermissionsAsync = async () => {
  return await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
      allowAnnouncements: true,
    },
  });
};

export default function App() {

  useEffect(() => {
    Notifications.getExpoPushTokenAsync().then((pushToken) => {
      console.log(pushToken);
    });
  }, []);

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log(notification);
        const user = notification.request.content.data.userName;
        console.log(user);
      }
    );

    const sub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log(response);
      }
    );

    return () => {
      subscription.remove();
      sub.remove();
    }; // clean up function !

  }, []);

  const scheduleNotificationHandler = async () => {
    const hasPushNotificationPermissionGranted = await allowsNotificationsAsync();
    if (!hasPushNotificationPermissionGranted) {
      await requestPermissionsAsync();
    }
    Notifications.scheduleNotificationAsync({
      content: {
        title: 'My first local notification',
        body: 'This is the body of the notification',
        data: { userName: 'Max'},
      },
      trigger: {
        seconds: 5,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Button  title='Schedule notification' onPress={scheduleNotificationHandler} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
