import React, { useEffect, useState } from 'react';
import { View, Button, Linking } from 'react-native';
import TelegramLoginButton from 'react-telegram-login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Text } from 'react-native-web';

const Home = () => {
  const [joke, setJoke] = useState();
  const [response, setResponse] = useState();
  const [refresh, setRefresh] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [send, setSend] = useState(false);
  let botToken;
(async () => {
  try {
    const response = await axios.get('https://bbaaj2g0k9dcmm6ebmo7.containers.yandexcloud.net/token');
    botToken = response.data;
    // Здесь можно выполнять дополнительные действия с botToken
  } catch (error) {
    console.error(error);
  }
})();
  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('id', jsonValue);
    } catch (e) {
    }
  };
  const sendJokeToBackend = async (joke) => {
    try {
      const chatId = response.id;
      const url = 'https://bbaaj2g0k9dcmm6ebmo7.containers.yandexcloud.net/send-joke';
      const data = {
        chat_id: chatId,
        joke: joke,
      };
    
      await axios.post(url, data);
      console.log('Анекдот отправлен на бэкенд');
      console.log('Received joke:', joke, 'for chat ID:', chatId);
    } catch (error) {
      console.error('Ошибка при отправке анекдота на бэкенд:', error);
    }
  };
  
  const handleTelegramResponse = async (response) => {
    setResponse(response);
    await storeData(response);
    setIsLoggedIn(true);
    await sendTelegramDataToServer(response);
  };
  const sendTelegramDataToServer = async (response) => {
    let success = false;
    try {
      const url = 'https://bbaaj2g0k9dcmm6ebmo7.containers.yandexcloud.net/auth';
      const data = {
        id: response.id,
        first_name: response.first_name,
        last_name: response.last_name,
        username: response.username,
        photo_url: response.photo_url,
        auth_date: response.auth_date,
        hash: response.hash,
      };
  
      await axios.post(url, data);
      console.log('Данные отправлены на сервер');
      success = true;   
  
      // Проверка результата на сервере
      const result = await checkResult(response);
      setIsLoggedIn(result);
  
      // Перенаправление на главную страницу, если результат равен false
      if (!result) {
        Linking.openURL('https://zvezdanutiyfix.netlify.app');
      }
    } catch (error) {
      console.error('Ошибка при отправке данных на сервер:', error);
    }
    if (!success) {
      // Если данные не отправились на сервер, перенаправляем пользователя на страницу авторизации
      setIsLoggedIn(false);
      setRefresh(false); // сбрасываем значение refresh
      setResponse(null); // сбрасываем значение response
    }
  };
  const checkResult = async (response) => {
    try {
      const url = 'https://bbaaj2g0k9dcmm6ebmo7.containers.yandexcloud.net/auth';
      const result = await axios.post(url, response);
      console.log('Результат проверки:', result.data);
  
      return result.data;
    } catch (error) {
      console.error('Ошибка при проверке результата:', error);
      return false;
    }
  };
  
  const getAnekdot = async (object, refresh) => {
    object = JSON.stringify(object);
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': encodeURIComponent(object)
        }
      };
      let url = 'https://bba878ml8a3u9vp5cpug.containers.yandexcloud.net/anekdot';
      if (refresh) {
        url = 'https://bba878ml8a3u9vp5cpug.containers.yandexcloud.net/anekdot';
      }
      const response = await axios.get(url, config);
      console.log(response.data.Text);
      return response.data.Text;
    } catch (error) {
      console.error(error);
    }
  };

  const handleRefresh = (value) => {
    console.log(response);
    setRefresh(value);
    if (send === true) {
      sendJokeToBackend(joke); // Используйте функцию для отправки анекдота на бэкенд
    }
    setSend(true);
  };

  useEffect(() => {
    if (refresh) {
      getAnekdot(response, refresh).then((anekdot) => {
        setJoke(anekdot);
        setRefresh(false);
      });
    }
  }, [refresh]);
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {!isLoggedIn && <TelegramLoginButton dataOnauth={handleTelegramResponse} botName="Rjaka_prikol_bot" />}
      {isLoggedIn && (
        <React.Fragment>
          <View>{joke && <Text>{joke}</Text>}</View>
          <Button title="Обновить анекдот" onPress={() => handleRefresh(true)} />
        </React.Fragment>
      )}
    </View>
  );
};

export default Home;
