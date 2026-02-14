// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCQpVi3RjEUxUakSW9pvpx3lXzbyd_Yc2I",
    authDomain: "maintenance-buddy-c5b97.firebaseapp.com",
    projectId: "maintenance-buddy-c5b97",
    storageBucket: "maintenance-buddy-c5b97.firebasestorage.app",
    messagingSenderId: "841112335095",
    appId: "1:841112335095:web:ee09c6ee05ffd2da9a59f2",
    measurementId: "G-2P2RCT8R6G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);