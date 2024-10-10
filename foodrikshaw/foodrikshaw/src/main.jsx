import React from "react";
import ReactDOM from "react-dom/client";
import Routs from "./componants/Routs.jsx";
import Home from "./componants/Home.jsx";
import Nav from "./componants/Nav.jsx";
import Layout from "./componants/Layout.jsx";
import "/main.css";
import Userprovider from "./componants/Userprovider.jsx";
import Purchaseprovider from "./componants/Purchaseprovider.jsx";

// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker
//     .register("/firebase-messaging-sw.js")
//     .then((registration) => {
//       console.log("Service Worker registered with scope:", registration.scope);
//     })
//     .catch((err) => {
//       console.log("Service Worker registration failed:", err);
//     });
// }
ReactDOM.createRoot(document.getElementById("root")).render(
  <Userprovider>
    <Purchaseprovider>
      <Routs />
    </Purchaseprovider>
  </Userprovider>
);
