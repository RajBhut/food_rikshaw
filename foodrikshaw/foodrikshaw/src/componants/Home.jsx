import React, { useContext, useEffect } from "react";
import "./home.css";
import { Link, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { Usercontext } from "./Userprovider";
import axios from "axios";
import Card from "./Card";
import { genrateToken } from "../notification/firebase";

export default function Home() {
  const navigate = useNavigate();
  const { user, setuser } = useContext(Usercontext);
  const getprofile = async () => {
    try {
      const response = await axios.get("http://localhost:3000/user/profile", {
        withCredentials: true,
      });
      if (response.data) {
        console.log(response.data);
        setuser(response.data);
      }
    } catch (error) {
      console.log("error", error);
      if (error.response && error.response.status === 401) {
        console.log("Unauthorized access - redirecting to login");
        navigate("/login");
      } else {
        console.log("An unexpected error occurred:", error);
      }
    }
  };
  useEffect(() => {
    //   getprofile();
  }, [navigate, setuser]);

  useEffect(() => {
    genrateToken();
  }, []);

  return (
    <>
      <div className="main_container">
        {/* <div className="search-container">
          <input type="text" placeholder="Search.." name="search" />
          <button type="submit">Submit</button>
        </div> */}

        <div className="content">
          <div className="Logo">
            <img src="/Designer.png" alt="" />
          </div>
          <div className="main_manu">
            <div className="image">
              <Link to={"/menu"} state={{ selectedTab: "lunch" }}>
                <img src="/aluu.png"></img>
              </Link>
            </div>
          </div>

          <div className="main_manu">
            <div className="image">
              <Link to={"/menu"} state={{ selectedTab: "dinner" }}>
                <img src="/sev_tam.jpg"></img>
              </Link>
            </div>
          </div>
          {/* <div className="cards"></div> */}
        </div>
      </div>
    </>
  );
}
