import React from "react";
import ReactDOM from "react-dom/client";
import Routs from "./componants/Routs.jsx";
import Home from "./componants/Home.jsx";
import Nav from "./componants/Nav.jsx";
import Layout from "./componants/Layout.jsx";
import "/main.css";
import Userprovider from "./componants/Userprovider.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <Userprovider>
    <Routs />
  </Userprovider>
);
