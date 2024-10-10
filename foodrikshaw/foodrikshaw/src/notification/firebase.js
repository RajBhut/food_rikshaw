// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { onMessage } from "firebase/messaging";
import { getMessaging, getToken } from "firebase/messaging";
const firebaseConfig = {
  apiKey: "AIzaSyDuFG2LIo72guuRrj4tLBoJsLP6eHdODkM",
  authDomain: "foodrikshaw-d0324.firebaseapp.com",
  projectId: "foodrikshaw-d0324",
  storageBucket: "foodrikshaw-d0324.appspot.com",
  messagingSenderId: "690195119498",
  appId: "1:690195119498:web:0c56879ea9019c80eb5c73",
  measurementId: "G-9JWMF8GJM3",
};

const app = initializeApp(firebaseConfig);

// Get Firebase Messaging object
const messaging = getMessaging(app);

export const requestForToken = async () => {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey:
        "BAt-jvAhE1Nmvx5u9R0M8_EehpZocljoJs_0saLeLbMACKpOBzR6eIymYkQSwJa_tysVJONUaOny01ixL_7i7Xk",
    });
    console.log("Token received: ", token);
    return token;
  } else {
    console.log("Permission not granted for notifications");
  }
};
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("Message received: ", payload);
      resolve(payload);
    });
  });
