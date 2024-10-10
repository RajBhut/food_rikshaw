import React from "react";
import { createContext, useState } from "react";
const Usercontext = createContext();

export default function Userprovider({ children }) {
  const [user, setuser] = useState({});
  const [isadmin, setisadmin] = useState(false);
  return (
    <Usercontext.Provider value={{ user, setuser, isadmin, setisadmin }}>
      {children}
    </Usercontext.Provider>
  );
}
export { Usercontext };
