import React from 'react';
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

export default class Favorites extends React.Component {
    state = {
        contacts: store.getState().contacts,
        loading: store.getState().isFetchingContacts,
        error: store.getState().error,
    };

    async componentDidMount() {
        const { contacts } = this.state;

        this.unsubscribe = store.onChange( () =>
            this.setState( {
                contacts: store.getState().contacts,
                loading: store.getState().isFetchingContacts,
                error: store.getState().error,
            } ),
        );

        if ( contacts.length === 0 ) {
            try {
                const contacts = await fetchContacts();

                store.setState( {
                    contacts,
                    isFetchingContacts: false,
                    error: false,
                } );
            } catch ( e ) {
                console.log( "Favorites -> Error fetching favorites: " + e );
                store.setState( {
                    isFetchingContacts: false,
                    error: true,
                } );
            }
        }
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    renderFavoriteThumbnail = ( { item } ) => {
        const { avatar } = item;
        const { navigation } = this.props;

        return (
            <ContactThumbnail
                avatar={ avatar }
                onPress={ () => navigation.navigate( 'Profile', { id: item.id } ) }
            />
        );
    };

    render() {
        const { loading, contacts, error } = this.state;
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
                            renderItem={ this.renderFavoriteThumbnail }
                        />
                    )
                }
            </View>
        );
    }
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