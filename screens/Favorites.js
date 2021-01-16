import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    ActivityIndicator,
} from 'react-native';

import { fetchContacts } from '../utils/api';
import store from '../store';
import ContactThumbnail from '../components/ContactThumbnail';

const keyExtractor = ( { phone } ) => phone;

export default function Favorites( props ) {
    const [ state, setState ] = useState(
        {
            contacts: store.getState().contacts,
            loading: store.getState().isFetchingContacts,
            error: store.getState().error,
        }
    );

    useEffect( () => {
        const { contacts } = state;

        const unsubscribe = store.onChange( () =>
            setState( {
                contacts: store.getState().contacts,
                loading: store.getState().isFetchingContacts,
                error: store.getState().error,
            } ),
        );

        if ( contacts.length === 0 ) {
            fetchContacts().then( ( contacts ) => {
                store.setState( {
                    contacts,
                    isFetchingContacts: false,
                    error: false,
                } );
            }, ( error ) => {
                console.log( "Favorites -> Error fetching favorites: " + error );
                store.setState( {
                    isFetchingContacts: false,
                    error: true,
                } );
            } );
        }

        return () => unsubscribe();
    } );

    const renderFavoriteThumbnail = ( { item } ) => {
        const { avatar } = item;
        const { navigation } = props;

        return (
            <ContactThumbnail
                avatar={ avatar }
                onPress={ () => navigation.navigate( 'Profile', { id: item.id } ) }
            />
        );
    };

    const { loading, contacts, error } = state;
    const favorites = contacts.filter( contact => contact.favorite );

    return (
        <View style={ styles.container }>
            {loading && <ActivityIndicator size="large" /> }
            {error && <Text>Error...</Text> }

            {!loading &&
                !error && (
                    <FlatList
                        data={ favorites }
                        keyExtractor={ keyExtractor }
                        numColumns={ 3 }
                        contentContainerStyle={ styles.list }
                        renderItem={ renderFavoriteThumbnail }
                    />
                )
            }
        </View>
    );
}

const styles = StyleSheet.create( {
    container: {
        backgroundColor: 'white',
        justifyContent: 'center',
        flex: 1,
    },
    list: {
        alignItems: 'center',
    },
} );