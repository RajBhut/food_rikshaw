// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDuFG2LIo72guuRrj4tLBoJsLP6eHdODkM",
  authDomain: "foodrikshaw-d0324.firebaseapp.com",
  projectId: "foodrikshaw-d0324",
  storageBucket: "foodrikshaw-d0324.appspot.com",
  messagingSenderId: "690195119498",
  appId: "1:690195119498:web:0c56879ea9019c80eb5c73",
  measurementId: "G-9JWMF8GJM3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const genrateToken = async () => {
  const permision = await Notification.requestPermission();
  if (permision === "granted") {
    const token = await getToken(messaging, {
      vapidKey:
        "BAt-jvAhE1Nmvx5u9R0M8_EehpZocljoJs_0saLeLbMACKpOBzR6eIymYkQSwJa_tysVJONUaOny01ixL_7i7Xk",
    });
    console.log(token);
  }
};
