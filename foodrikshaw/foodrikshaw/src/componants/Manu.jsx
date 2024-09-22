import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Card from "./Card";
import "./menu.css";
const Manu = () => {
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState("lunch");

  useEffect(() => {
    if (location.state && location.state.selectedTab) {
      setSelectedTab(location.state.selectedTab);
    }
  }, [location]);

  return (
    <div>
      <div className="tabs bg-slate-200 h-16 flex justify-around ">
        <button
          className={selectedTab === "lunch" ? "active" : ""}
          onClick={() => setSelectedTab("lunch")}
        >
          Lunch
        </button>
        <button
          className={selectedTab === "dinner" ? "active" : ""}
          onClick={() => setSelectedTab("dinner")}
        >
          Dinner
        </button>
      </div>
      <div className="tab-content flex h-full flex-wrap justify-center gap-2 my-3 ">
        {selectedTab === "lunch" &&
          Array.from({ length: 5 }).map((_, index) => (
            <Card
              key={index}
              name="Alu Sabji"
              price={25}
              tag="Lunch Special"
              imageUrl="/aluu.png"
            />
          ))}
        {selectedTab === "dinner" &&
          Array.from({ length: 5 }).map((_, index) => (
            <Card
              key={index}
              name="Sev Tamatar"
              price={25}
              tag="Dinner Special"
              imageUrl="/sev_tam.jpg"
            />
          ))}
      </div>
    </div>
  );
};

export default Manu;
