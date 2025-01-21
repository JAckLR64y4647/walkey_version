import React, { useEffect, Dispatch, SetStateAction } from 'react';
import { View, Text } from 'react-native';
import { ClerkProvider, ClerkLoaded, useUser } from '@clerk/clerk-react-native';
import SplashScreen from 'react-native-splash-screen';
import { tokenCache } from '../lib/auth';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

export default function RootLayout() {
  const [loaded, setLoaded] = React.useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      setLoaded(true);
    };

    loadFonts();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hide();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  if (!publishableKey) {
    throw new Error(
      'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env'
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <AppContent setUserData={setUserData} setDogsData={setDogsData} />
      </ClerkLoaded>
    </ClerkProvider>
  );
}

type AppContentProps = {
  setUserData: Dispatch<SetStateAction<any>>;
  setDogsData: Dispatch<SetStateAction<any>>;
};

function AppContent({ setUserData, setDogsData }: AppContentProps) {
  const { user } = useUser();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !user.id) return;

      try {
        const SERVER_URL = 'http://192.168.0.18:3000';

        const userResponse = await fetch(
          `${SERVER_URL}/api/user?clerkId=${user.id}`
        );
        const userData = await userResponse.json();
        setUserData(userData);

        const dogsResponse = await fetch(
          `${SERVER_URL}/api/users/locations?clerkId=${user.id}`
        );
        const dogsData = await dogsResponse.json();
        setDogsData(dogsData);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };

    fetchUserData();
  }, [user, setUserData, setDogsData]);

  return (
    <View>
      <Text>App Content Loaded</Text>
    </View>
  );
}
