import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Contacts from './screens/Contacts';
import Profile from './screens/Profile';
import Favorites from './screens/Favorites';
import User from './screens/User';

import colors from './utils/colors';
import store from './store';

const Stack = createStackNavigator();
function ContactsScreens() {
    return (
        <Stack.Navigator
            initialRouteName="Contacts"
            screenOptions={ {
                headerStyle: {
                    backgroundColor: colors.blue,
                },
                headerTintColor: 'white',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            } }>
            <Stack.Screen
                name="Contacts"
                component={ Contacts }
            />
            <Stack.Screen
                name="Profile"
                component={ Profile }
                options={ ( { route } ) => ( {
                    title: getUserById( route.params.id ).split( ' ' )[ 0 ],
                    headerBackTitle: 'Back',
                } ) }
            />
        </Stack.Navigator>
    );
}

const getUserById = id => {
    const { name } = store.getState().contacts.find( contact => contact.id === id );
    return name;
};

function FavoriteScreens() {
    return (
        <Stack.Navigator
            initialRouteName="Favorites"
            screenOptions={ {
                headerStyle: {
                    backgroundColor: colors.blue,
                },
                headerTintColor: 'white',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            } }>
            <Stack.Screen
                name="Favorites"
                component={ Favorites }
            />
            <Stack.Screen
                name="Profile"
                component={ Profile }
                options={ ( { route } ) => ( {
                    title: getUserById( route.params.id ).split( ' ' )[ 0 ],
                    headerBackTitle: 'Back',
                } ) }
            />
        </Stack.Navigator>
    );
}

const Tab = createBottomTabNavigator();
export default function TabNavigator() {
    return (
        <Tab.Navigator
            initialRouteName="Contacts"
            screenOptions={ {
                headerStyle: {
                    backgroundColor: colors.blue,
                },
                headerTintColor: 'white',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            } }
            tabBarOptions={ {
                activeTintColor: colors.blue,
                inactiveTintColor: colors.greyDark,
                tabStyle: {
                    backgroundColor: colors.greyLight,
                    padding: 1,

                },
                showLabel: false,
            } }
        >
            <Tab.Screen
                name="Contacts"
                component={ ContactsScreens }
                options={ {
                    tabBarIcon: ( { color, size } ) => (
                        <Icon name="list" color={ color } size={ size } />
                    ),
                } }
            />
            <Tab.Screen
                name="Favorites"
                component={ FavoriteScreens }
                options={ {
                    title: 'Favorites',
                    tabBarIcon: ( { color, size } ) => (
                        <Icon name="favorite" color={ color } size={ size } />
                    ),
                } }
            />
            <Tab.Screen
                name="Me"
                component={ User }
                options={ {
                    tabBarIcon: ( { color, size } ) => (
                        <Icon name="face" color={ color } size={ size } />
                    )
                } }
            />
        </ Tab.Navigator >
    );
}
