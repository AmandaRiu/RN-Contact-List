import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
} from 'react-native';

import ContactThumbnail from '../components/ContactThumbnail';
import colors from '../utils/colors';
import { fetchUserContact } from '../utils/api';
import store from '../store';

export default function User( props ) {
    const [ user, setUser ] = useState( store.getState().user );
    const [ loading, setLoading ] = useState( store.getState().isFetchingUser );
    const [ error, setError ] = useState( store.getState().error );

    const { avatar, name, phone } = user;

    useEffect( () => {
        const unsubscribe = store.onChange( () => {
            console.log( "User > useEffect > fired!" );
            setUser( store.getState().user );
            setLoading( store.getState().isFetchingUser );
            setError( store.getState().error );
        } );

        if ( Object.entries( user ).length === 0 ) {
            fetchUserContact().then( user => {
                store.setState( {
                    user,
                    isFetchingUser: false,
                    error: false,
                } );
            }, error => {
                console.log( "User -> Error loading user: " + error );
                store.setState( {
                    isFetchingUser: false,
                    error: true,
                } );
            } );
        }

        return () => unsubscribe();
    }, [] );

    return (
        <View style={ styles.container }>
            {loading && <ActivityIndicator size="large" /> }
            {error && <Text>Error...</Text> }

            {!loading && (
                <ContactThumbnail
                    avatar={ avatar }
                    name={ name }
                    phone={ phone }
                />
            ) }
        </View>
    );
}

const styles = StyleSheet.create( {
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.blue,
    },
} );
