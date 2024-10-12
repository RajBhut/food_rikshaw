import axios from "axios";
import React, { useState } from "react";
import Cookies from "js-cookie";
import { json, useNavigate } from "react-router-dom";

export default function About() {
  const [users, setUsers] = useState({});
  const [eror, seteror] = useState(false);
  const navigat = useNavigate();
  const handleclick = async () => {
    const token = Cookies.get("jwt");

    try {
      const data = await axios.get(`${import.meta.env.API_URL}/user/all`, {
        withCredentials: true,
      });
      setUsers(data);
    } catch (error) {
      if (error.status == 400) navigat("/");
      console.log(error);
      seteror(true);
    }
  };
  return (
    <>
      {eror ? (
        <h1>eroor in fatching</h1>
      ) : (
        <button onClick={handleclick}>get data</button>
      )}
    </>
  );
}
