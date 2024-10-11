import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { PurchaseContext } from "./Purchaseprovider";
import Card from "./Card";
import axios from "axios";
import "./menu.css"; // You can add custom styles if needed

axios.defaults.withCredentials = true;

const Manu = () => {
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState("lunch");
  const { addedproduct, setaddedproduct, total, settotal } =
    useContext(PurchaseContext);
  const [lunch, setlunch] = useState([]);
  const [dinner, setdinner] = useState([]);
  const [products, setProducts] = useState();

  const fetchData = async () => {
    const response = await axios.get(
      "https://food-rikshaw-64to.vercel.app/product"
    );
    setProducts(response.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (products) {
      products.map((product) => {
        if (product.time === "lunch") setlunch((prev) => [...prev, product]);
        else setdinner((prev) => [...prev, product]);
      });
    }
  }, [products]);

  useEffect(() => {
    if (location.state && location.state.selectedTab) {
      setSelectedTab(location.state.selectedTab);
    }
  }, [location]);

  const handlepurchase = async () => {
    try {
      const res = await axios.post(
        "https://food-rikshaw-64to.vercel.app/purchase/buy"
      );
      settotal(0);
      setaddedproduct([]);
      console.log("Purchase successful!", res.data);
    } catch (error) {
      console.error("Error during purchase:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Tabs */}
      <div className="tabs bg-gray-200 h-16 flex justify-center items-center space-x-8">
        <button
          className={`py-2 px-4 rounded-md ${
            selectedTab === "lunch"
              ? "bg-blue-500 text-white"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
          onClick={() => setSelectedTab("lunch")}
        >
          Lunch
        </button>
        <button
          className={`py-2 px-4 rounded-md ${
            selectedTab === "dinner"
              ? "bg-blue-500 text-white"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
          onClick={() => setSelectedTab("dinner")}
        >
          Dinner
        </button>
      </div>

      {/* Product Cards */}
      {products ? (
        <div className="container mx-auto py-8 px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedTab === "lunch" && (
            <>
              {lunch.map((pro, index) => (
                <Card
                  className="card"
                  id={pro._id}
                  key={index}
                  name={pro.name}
                  price={pro.price}
                />
              ))}
            </>
          )}
          {selectedTab === "dinner" && (
            <>
              {dinner.map((pro, ind) => (
                <Card
                  className="card"
                  id={pro._id}
                  key={ind}
                  name={pro.name}
                  price={pro.price}
                />
              ))}
            </>
          )}
        </div>
      ) : (
        <h1 className="text-center text-2xl mt-10">Loading...</h1>
      )}

      {/* Total & Checkout */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg flex justify-between items-center">
        <span className="text-xl font-semibold">Total Price: ₹{total}</span>
        <button
          onClick={handlepurchase}
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Manu;
