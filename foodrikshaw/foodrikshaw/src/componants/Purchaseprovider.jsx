import React from "react";
import { useState, createContext } from "react";
const PurchaseContext = createContext();
export default function Purchaseprovider({ children }) {
  const [addedproduct, setaddedproduct] = useState([]);
  const [total, settotal] = useState(0);
  const [first_fetch, setfirstfetch] = useState(true);
  return (
    <PurchaseContext.Provider
      value={{
        addedproduct,
        setaddedproduct,
        total,
        settotal,
        first_fetch,
        setfirstfetch,
      }}
    >
      {children}
    </PurchaseContext.Provider>
  );
}
export { PurchaseContext };
