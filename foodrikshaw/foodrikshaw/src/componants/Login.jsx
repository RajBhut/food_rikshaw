import React, { useContext } from "react";
import "./login.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Usercontext } from "./Userprovider";
export default function Login() {
  const { user, setuser } = useContext(Usercontext);
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const [formdata, setformdata] = useState({
    email: "",
    password: "",
    name: "",
    conformpassword: "",
  });

  const [error, seterror] = useState("");
  const handlechange = (e) => {
    setformdata({ ...formdata, [e.target.name]: e.target.value });
  };
  const handlesubmit = async (e) => {
    e.preventDefault();
    if (formdata.password !== formdata["conformpassword"]) {
      seterror("password not matched");
      return;
    }

    if (formdata.email === "" || formdata.password === "") {
      seterror("Please fill all the fields");
    } else {
      await axios
        .post(`${import.meta.env.VITE_API_URL}/user/`, formdata)
        .then((res) => {
          if (res.status >= 400) {
            seterror("Invalid email or password");
          } else {
            navigate("/");
          }
        });
    }
  };

  useEffect(() => {
    if (formdata.email != "" && formdata.password != "") {
      seterror("");
    }
  }, [seterror]);

  return (
    <>
      {" "}
      <form onSubmit={handlesubmit}>
        <div className="container">
          <div className="name">
            <label htmlFor="name">Name:</label>
            <input onChange={handlechange} type="text" name="name" />
          </div>

          <div className="email">
            <label htmlFor="email">Email:</label>
            <input onChange={handlechange} type="text" name="email" />
          </div>

          <div className="password">
            <label htmlFor="password"> Password:</label>
            <input onChange={handlechange} type="password" name="password" />
          </div>
          <div className="password">
            <label htmlFor="password">Conform Password:</label>
            <input
              onChange={handlechange}
              type="password"
              name="conformpassword"
            />
          </div>
          <span style={{ color: "red" }}>{error}</span>
          <button onClick={handlesubmit} className="sub">
            Login
          </button>
        </div>
        <Link to={"/log"}>alredy have account? </Link>
      </form>
      <div>
        <button>
          <Link to={"/"}>Home </Link>{" "}
        </button>
      </div>
    </>
  );
}
