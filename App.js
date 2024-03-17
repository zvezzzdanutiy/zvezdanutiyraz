import React, { useEffect } from 'react';
import { View, Button, Linking } from 'react-native';

const Home = () => {
  const handleTelegramButtonClick = () => {
    const url = 'https://oauth.telegram.org/auth?bot_id=7122476551:AAGRldhloWEs-_jWsEkOTMZEsXhGE0dbXWQ&scope=write&nonce=12345678&origin=https://zvezdanutiyt.netlify.app/&request_access=write&return_to=https://t.me/Rjaka_prikol_bot';

    Linking.openURL(url);
  };

  useEffect(() => {
    const handleUrlChange = (event) => {
      const { url } = event;
      // Обработайте URL-адрес после авторизации
      console.log(url);
    };

    Linking.getInitialURL()
      .then((url) => {
        if (url) {
          // Обработайте первоначальный URL-адрес после авторизации
          console.log(url);
        }
      })
      .catch((error) => console.log(error));

    Linking.addEventListener('url', handleUrlChange);

    return () => {
      Linking.removeEventListener('url', handleUrlChange);
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Авторизация через Telegram" onPress={handleTelegramButtonClick} />
    </View>
  );
};

export default Home;