import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { useTranslation } from 'react-i18next';

import HomeScreen from '../screens/HomeScreen';
import MatchesScreen from '../screens/MatchesScreen';
import TeamsScreen from '../screens/TeamsScreen';
import NewsScreen from '../screens/NewsScreen';
import ForumScreen from '../screens/ForumScreen';

export type RootTabParamList = {
  Home: undefined;
  Matches: undefined;
  Teams: undefined;
  News: undefined;
  Forum: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const BottomTabNavigator = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Matches':
              iconName = focused ? 'football' : 'football-outline';
              break;
            case 'Teams':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'News':
              iconName = focused ? 'newspaper' : 'newspaper-outline';
              break;
            case 'Forum':
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#16a34a',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 85 : 60,
          paddingBottom: Platform.OS === 'ios' ? 25 : 5,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: '#16a34a',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: t('common.home') }}
      />
      <Tab.Screen
        name="Matches"
        component={MatchesScreen}
        options={{ title: t('common.matches') }}
      />
      <Tab.Screen
        name="Teams"
        component={TeamsScreen}
        options={{ title: t('common.teams') }}
      />
      <Tab.Screen
        name="News"
        component={NewsScreen}
        options={{ title: t('common.news') }}
      />
      <Tab.Screen
        name="Forum"
        component={ForumScreen}
        options={{ title: t('common.forum') }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
