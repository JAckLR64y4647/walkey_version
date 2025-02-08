import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { View } from 'react-native';
import { icons } from '../../../constants/svg';
import WalkEndScreen from '../../../app/(root)/(modal)/WalkEndScreen';
import HomeNotificationModal from '../../../app/(root)/(modal)/HomeNotificationModal';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabIcon: React.FC<{ IconComponent: React.FC<{ width: number; height: number; fill: string; style?: object }>; focused: boolean }> = ({ IconComponent, focused }) => {
  const defaultFill = IconComponent === icons.HomeIcon ? '#FFF7F2' : '#FFE5D8';
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <IconComponent
        style={{ transform: [{ translateY: focused ? -1 : 0 }] }}
        width={28}
        height={28}
        fill={focused ? '#FF6C22' : defaultFill}
      />
      {focused && <View style={{ width: 8, height: 8, backgroundColor: '#FF6C22', borderRadius: 4, marginTop: 4 }} />}
    </View>
  );
};

const TabsLayout = () => (
  <Tab.Navigator
    initialRouteName="home"
    screenOptions={{
      tabBarActiveTintColor: '#FF6C22',
      tabBarShowLabel: false,
      tabBarStyle: {
        borderRadius: 50,
        paddingBottom: 5,
        paddingTop: 10,
        height: 80,
        backgroundColor: '#FFF7F2',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
      },
    }}>
    <Tab.Screen
      name="home"
      component={() => null}
      options={{
        headerShown: false,
        tabBarIcon: ({ focused }) => <TabIcon focused={focused} IconComponent={icons.HomeIcon} />, 
        tabBarItemStyle: { paddingLeft: 20 },
      }}
    />
    <Tab.Screen
      name="map"
      component={() => null}
      options={{
        headerShown: false,
        tabBarIcon: ({ focused }) => <TabIcon focused={focused} IconComponent={icons.MapIcon} />,
      }}
    />
    <Tab.Screen
      name="doctor"
      component={() => null}
      options={{
        headerShown: false,
        tabBarIcon: ({ focused }) => <TabIcon focused={focused} IconComponent={icons.DoctorIcon} />,
      }}
    />
    <Tab.Screen
      name="emotions"
      component={() => null}
      options={{
        headerShown: false,
        tabBarIcon: ({ focused }) => <TabIcon focused={focused} IconComponent={icons.EmotionsIcon} />, 
        tabBarItemStyle: { paddingRight: 20 },
      }}
    />
  </Tab.Navigator>
);

const Layout = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Tabs" component={TabsLayout} options={{ headerShown: false }} />
      <Stack.Screen
        name="WalkEndScreen"
        component={WalkEndScreen}
        options={{
          headerShown: false,
          presentation: 'transparentModal',
          cardStyleInterpolator: ({ current, layouts }) => ({
            cardStyle: {
              transform: [
                {
                  translateY: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.height, 0],
                  }),
                },
              ],
            },
          }),
        }}
      />
      <Stack.Screen
        name="HomeNotificationModal"
        component={HomeNotificationModal}
        options={{
          headerShown: false,
          presentation: 'transparentModal',
          cardStyle: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default Layout;
