import { Routes, Route, BrowserRouter } from "react-router-dom";
import React from "react";
import Home from "./Home";
import Login from "./Login";
import About from "./About";
import Layout from "./Layout";
import Manu from "./Manu";
import Log from "./Log";
import Admin from "./Admin";
export default function Routs() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/log" element={<Log />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />

          <Route
            path="/about"
            element={
              <Layout>
                <About />
              </Layout>
            }
          />
          <Route
            path="/menu"
            element={
              <Layout>
                <Manu />
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}
