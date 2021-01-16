import React from 'react';
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

export default class User extends React.Component {
    state = {
        user: store.getState().user,
        loading: store.getState().isFetchingUser,
        error: store.getState().error,
    };

    async componentDidMount() {
        this.unsubscribe = store.onChange( () =>
            this.setState( {
                user: store.getState().user,
                loading: store.getState().isFetchingUser,
                error: store.getState().error,
            } )
        );

        const { user } = this.state;

        if ( Object.entries( user ).length === 0 ) {
            try {
                const user = await fetchUserContact();

                store.setState( {
                    user,
                    isFetchingUser: false,
                    error: false,
                } );
            } catch ( e ) {
                console.log( "User -> Error loading user: " + e );
                store.setState( {
                    isFetchingUser: false,
                    error: true,
                } );
            }
        }
    };

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        console.log( "User > render > " + JSON.stringify( this.state ) );
        const { user, loading, error } = this.state;
        const { avatar, name, phone } = user;

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
}

const styles = StyleSheet.create( {
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.blue,
    },
} );
