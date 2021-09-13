import 'firebase/auth';
import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyADvxp1Q45tIRuOopEKL236kRk58RcN4IE",
    authDomain: "keepers-bar.firebaseapp.com",
    databaseURL: "https://keepers-bar.firebaseio.com",
    projectId: "keepers-bar",
    storageBucket: "keepers-bar.appspot.com",
    messagingSenderId: "969658710393",
    appId: "1:969658710393:web:c488c1fa0fe19f3f83d7a8",
    measurementId: ""
};
const app = firebase.initializeApp(firebaseConfig);

export { firebase };