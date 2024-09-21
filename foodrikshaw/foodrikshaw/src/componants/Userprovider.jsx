import React from 'react'
import { createContext ,useState } from 'react'
const Usercontext = createContext();

export default function Userprovider({children}) {
const [user , setuser] = useState({});

  return (
    <Usercontext.Provider value={{user , setuser}}>
        {children}
    </Usercontext.Provider>
  )
}
export {Usercontext}