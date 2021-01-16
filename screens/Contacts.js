import React from 'react';
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

export default class Contacts extends React.Component {
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
                console.log( "Contacts -> Error fetching contacts: " + e );
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

    renderContact = ( { item } ) => {
        const { name, avatar, phone } = item;
        const { navigation } = this.props;

        return (
            <ContactListItem name={ name } avatar={ avatar } phone={ phone } onPress={ () => navigation.navigate( 'Profile', { id: item.id } ) } />
        );
    };

    render() {
        const { loading, contacts, error } = this.state;

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
                            renderItem={ this.renderContact } />
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
} );