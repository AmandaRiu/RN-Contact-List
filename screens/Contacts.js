import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    ActivityIndicator
} from 'react-native';

import ContactListItem from '../components/ContactListItem';
import { fetchContacts } from '../utils/api';
import store from '../store';

const keyExtractor = ( { phone } ) => phone;

export default function Contacts( props ) {
    const [ state, setState ] = useState( {
        contacts: store.getState().contacts,
        loading: store.getState().isFetchingContacts,
        error: store.getState().error,
    } );

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
            fetchContacts().then( contacts => {
                store.setState( {
                    contacts,
                    isFetchingContacts: false,
                    error: false,
                } );
            }, error => {
                console.log( "Contacts -> Error fetching contacts: " + error );
                store.setState( {
                    isFetchingContacts: false,
                    error: true,
                } );
            } );
        }

        return () => unsubscribe();
    } );

    const renderContact = ( { item } ) => {
        const { name, avatar, phone } = item;
        const { navigation } = props;

        return (
            <ContactListItem name={ name } avatar={ avatar } phone={ phone } onPress={ () => navigation.navigate( 'Profile', { id: item.id } ) } />
        );
    };

    const { loading, contacts, error } = state;
    const contactsSorted = contacts.sort( ( a, b ) =>
        a.name.localeCompare( b.name ),
    );

    return (
        <View style={ styles.container }>
            {loading && <ActivityIndicator size="large" /> }
            {error && <Text>Error...</Text> }
            {!loading &&
                !error && (
                    <FlatList
                        data={ contactsSorted }
                        keyExtractor={ keyExtractor }
                        renderItem={ renderContact } />
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
} );