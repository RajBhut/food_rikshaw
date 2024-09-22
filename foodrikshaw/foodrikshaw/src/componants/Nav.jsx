import React, { useContext } from "react";
import "./Nav.css";
import { Link } from "react-router-dom";
import { Usercontext } from "./Userprovider";
export default function Nav() {
  const { user, setuser } = useContext(Usercontext);

  return (
    <>
      <nav>
        <ul>
          <Link to={"/"}>
            <li>Home</li>
          </Link>
          <Link to={"/menu"}>
            <li>Menu</li>
          </Link>
          <li>About</li>
          {user ? (
            <li>{user.name}</li>
          ) : (
            <Link to={"/login"}>
              <li>Login</li>
            </Link>
          )}
        </ul>
      </nav>
    </>
  );
}
