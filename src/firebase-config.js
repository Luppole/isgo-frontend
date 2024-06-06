// src/firebase-config.js
import firebase from 'firebase/app';
import 'firebase/database';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  databaseURL: "https://your-project-id.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
const database = firebase.database();

export { app, database };
