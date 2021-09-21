import React, { useState } from 'react'
import { Button, Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import styles from './styles'
import { firebase } from '../../firebase/config'
import { NavigationProp, ParamListBase } from '@react-navigation/native'

const githubProvider = new firebase.auth.GithubAuthProvider();
const googleProvider = new firebase.auth.GoogleAuthProvider();


interface ILoginScreenProps {
    navigation: NavigationProp<ParamListBase>
};

export default function LoginScreen({ navigation } : ILoginScreenProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onFooterLinkPress = () => {
        navigation.navigate('Registration')
    }

    const onLoginGooglePress = () => {
        firebase.auth().signInWithPopup(googleProvider).then((result) => {
            navigation.navigate('Home', {user: result.user})
          }).catch((error) => {
              alert(error)
          });
    };

    const onLoginGithubPress = () => {
        firebase.auth().signInWithPopup(githubProvider).then((result) => {
            navigation.navigate('Home', {user: result.user})
          }).catch((error) => {
              alert(error)
          });
    };

    const onLoginPress = () => {
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((response) => {
                const uid = response.user?.uid
                const usersRef = firebase.firestore().collection('users')
                usersRef
                    .doc(uid)
                    .get()
                    .then(firestoreDocument => {
                        if (!firestoreDocument.exists) {
                            alert("User does not exist anymore.")
                            return;
                        }
                        const user = firestoreDocument.data()
                        navigation.navigate('Home', {user})
                    })
                    .catch(error => {
                        alert(error)
                    });
            })
            .catch(error => {
                alert(error)
            })
    }

    return (
        <View>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                <Image
                    style={styles.logo}
                    source={require('../../../assets/icon.png')}
                />
                <TextInput
                    style={styles.input}
                    placeholder='E-mail'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Password'
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <Button
                    onPress={() => onLoginPress()}
                    title={'Log in'}
                />
                <Button
                    onPress={() => onLoginGithubPress()}
                    title="Log in with Github"
                />
                <Button
                    onPress={() => onLoginGooglePress()}
                    title="Log in with Google"
                />
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>Don't have an account? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Sign up</Text></Text>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}