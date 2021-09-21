import React, { useEffect, useState } from 'react'
import { FlatList, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native'
import styles from './styles';
import { firebase } from '../../firebase/config'
import { NavigationProp, ParamListBase } from '@react-navigation/native'

interface IHomeScreenProps {
    user: any;
    navigation: NavigationProp<ParamListBase>;
};

class Entry {
    id!: string
    text!: string;
    authorID?: string
    createdAt?: firebase.firestore.Timestamp
}

export default function HomeScreen({ user, navigation } : IHomeScreenProps) {

    const [entityText, setEntityText] = useState('')
    const [entities, setEntities] = useState<Array<Entry>>([])

    const entityRef = firebase.firestore().collection('entities')
    const userID = user?.uid

    useEffect(() => {
        entityRef
            .where("authorID", "==", userID)
            .orderBy('createdAt', 'desc')
            .onSnapshot(
                querySnapshot => {
                    const newEntities : Array<Entry> = []
                    querySnapshot.forEach(doc => {
                        const entity = doc.data()
                        entity.id = doc.id
                        newEntities.push(entity as Entry)
                    });
                    setEntities(newEntities)
                },
                error => {
                    console.log(error)
                }
            )
    }, [userID])

    const onAddButtonPress = () => {
        if (entityText && entityText.length > 0) {
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();
            const data = {
                text: entityText,
                authorID: userID,
                createdAt: timestamp,
            };
            entityRef
                .add(data)
                .then(_doc => {
                    setEntityText('')
                    Keyboard.dismiss()
                })
                .catch((error) => {
                    alert(error)
                });
        }
    }

    const onLogoutPress = () => {
        firebase.auth().signOut().then(() => {
            navigation.navigate('Login')
            alert('You have logged out');
        }).catch((error) => {
            console.log('error: ' + error);
        })
    }

    const renderEntity = ({item, index}) => {
        return (
            <View style={styles.entityContainer}>
                <Text style={styles.entityText}>
                    {index}. {item.text}
                </Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={onLogoutPress}>
            <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder='Add new entity'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEntityText(text)}
                    value={entityText}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity style={styles.button} onPress={onAddButtonPress}>
                    <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
            </View>
            { entities && (
                <View style={styles.listContainer}>
                    <FlatList
                        data={entities}
                        renderItem={renderEntity}
                        keyExtractor={(item) => item.id}
                        removeClippedSubviews={true}
                    />
                </View>
            )}
        </View>
    )
}