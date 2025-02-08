import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { images } from "../../../constants/index";

const screenHeight = Dimensions.get('window').height;

const WalkEndScreen = () => {
  const navigation = useNavigation();
  const [backgroundVisible, setBackgroundVisible] = useState(false);  

  useEffect(() => {
    const timer = setTimeout(() => {
      setBackgroundVisible(true);
    }, 220);

    return () => clearTimeout(timer);  
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {backgroundVisible && (
        <View style={{ 
          position: 'absolute', 
          width: '100%', 
          height: '100%', 
          backgroundColor: 'rgba(0, 0, 0, 0.5)' 
        }} />
      )}

      <View 
        style={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          backgroundColor: 'white', 
          padding: 24, 
          borderTopLeftRadius: 30, 
          borderTopRightRadius: 30, 
          height: screenHeight - 115, 
          justifyContent: 'flex-start',
        }}
      >
        <View style={{ alignItems: 'center', marginTop: 28 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Байт закінчив прогулянку!</Text>

          <Image 
            source={images.welcomeLogo} 
            style={{ width: 150, height: 150, marginBottom: 32, marginTop: 130 }} 
          />

          <Text style={{ textAlign: 'center', color: '#6B7280', maxWidth: 250 }}>
            Схоже, він ні з ким не побачився :( {'\n'} Скористайтесь метчингом наступного разу для покращення прогулянки.
          </Text>      
        </View>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: 'absolute',
            bottom: 45,
            backgroundColor: 'black',
            borderRadius: 999,
            height: 56,
            justifyContent: 'center',
            alignItems: 'center',
            left: 0,
            right: 0,
            marginHorizontal: 25,
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center' }}>Добре</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WalkEndScreen;
