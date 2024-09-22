import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const Manu = () => {
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState("lunch");

  useEffect(() => {
    console.log(location.state); // Debugging line to check the state
    if (location.state && location.state.selectedTab) {
      setSelectedTab(location.state.selectedTab);
    }
  }, [location]);

  return (
    <div>
      <div className="tabs">
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
      <div className="tab-content">
        {selectedTab === "lunch" && <div>Lunch Content</div>}
        {selectedTab === "dinner" && <div>Dinner Content</div>}
      </div>
    </div>
  );
};

export default Manu;
