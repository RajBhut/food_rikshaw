import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { PurchaseContext } from "./Purchaseprovider";
import Card from "./Card";
import axios from "axios";
import "./menu.css";

const Manu = () => {
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState("lunch");
  const {
    productsmap,
    setproductsmap,
    addedproduct,
    setaddedproduct,
    total,
    settotal,
  } = useContext(PurchaseContext);
  const [lunch, setlunch] = useState([]);
  const [dinner, setdinner] = useState([]);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const add_to_cart = async (product) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/user/cart`,
      product,
      { withCredentials: true }
    );
  };

  const fetchData = async () => {
    const cachedMenu = localStorage.getItem("menu");
    const cachedETag = localStorage.getItem("menuETag");
    const cachedLastModified = localStorage.getItem("menuLastModified");
    try {
      const headers = {};
      if (cachedETag) headers["If-None-Match"] = cachedETag;
      if (cachedLastModified) headers["If-Modified-Since"] = cachedLastModified;

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/product`,
        {
          headers,
          withCredentials: true,
        }
      );
      console.log(response.headers);
      if (response.status === 200) {
        setProducts(response.data);

        localStorage.setItem("menu", JSON.stringify(response.data));
        localStorage.setItem("menuETag", response.headers.etag);
        localStorage.setItem(
          "menuLastModified",
          response.headers["last-modified"]
        );
      }
    } catch (error) {
      if (error.status == 304) {
        if (error.status === 304 && cachedMenu) {
          setProducts(JSON.parse(cachedMenu));
        }
      } else {
        console.error("Error fetching products:", error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      products.map((product) => {
        setproductsmap((prev) => ({
          ...prev,
          [product._id]: product,
        }));
      });

      const lunchItems = products.filter((product) => product.time === "lunch");
      const dinnerItems = products.filter(
        (product) => product.time === "dinner"
      );
      setlunch(lunchItems);
      setdinner(dinnerItems);
    }
  }, [products]);
  useEffect(() => {
    if (location.state && location.state.selectedTab) {
      setSelectedTab(location.state.selectedTab);
    }
  }, [location]);

  const handlepurchase = () => {
    setShowModal(true);
  };

  const handleAddProduct = (product) => {
    const existingProduct = addedproduct.find((p) => p._id === product._id);
    if (existingProduct) {
      setaddedproduct((prev) =>
        prev.map((p) =>
          p._id === product._id ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
      settotal((prev) => prev + product.price);
    } else {
      setaddedproduct((prev) => [...prev, { ...product, quantity: 1 }]);
      settotal((prev) => prev + product.price);
    }
  };

  const handleIncrement = (productId) => {
    const productToIncrement = addedproduct.findIndex(
      (prod) => prod.product_id === productId
    );
    if (productToIncrement != -1) {
      setaddedproduct((prev) => {
        const updatedProducts = [...prev];
        updatedProducts[productToIncrement].quantity += 1;
        add_to_cart(updatedProducts);
        return updatedProducts;
      });
      settotal((prev) => prev + addedproduct[productToIncrement].price);
    }
  };

  const handleDecrement = (productId) => {
    const ind = addedproduct.findIndex((prod) => prod.product_id === productId);
    if (ind !== -1 && addedproduct[ind].quantity > 1) {
      setaddedproduct((prev) => {
        const updatedProducts = [...prev];
        updatedProducts[ind].quantity -= 1;
        add_to_cart(updatedProducts);
        return updatedProducts;
      });
      settotal((prev) => prev - addedproduct[ind].price);
    } else if (addedproduct[ind].quantity === 1) {
      handleRemoveProduct(productId);
    }
  };

  const handleRemoveProduct = (productId) => {
    const productToRemove = addedproduct.findIndex(
      (prod) => prod.product_id === productId
    );
    if (productToRemove !== -1) {
      setaddedproduct((prev) =>
        prev.filter((prod) => prod.product_id !== productId)
      );
      add_to_cart(addedproduct);
      settotal(
        (prev) => prev - productToRemove.price * productToRemove.quantity
      );
    }
  };

  const handlePlaceOrder = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/purchase/buy`,
        { products: addedproduct },
        { withCredentials: true }
      );
      settotal(0);
      setaddedproduct([]);
      setShowModal(false);
    } catch (error) {
      console.error("Error placing the order:", error);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
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

      {products.length > 0 ? (
        <div className="container mx-auto py-8 px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedTab === "lunch" &&
            lunch.map((pro, index) => (
              <Card
                imageUrl={pro.img_url}
                className="card"
                id={pro._id}
                key={index}
                name={pro.name}
                price={pro.price}
                onClick={() => handleAddProduct(pro)}
              />
            ))}
          {selectedTab === "dinner" &&
            dinner.map((pro, ind) => (
              <Card
                className="card"
                imageUrl={pro.img_url}
                id={pro._id}
                key={ind}
                name={pro.name}
                price={pro.price}
                onClick={() => handleAddProduct(pro)}
              />
            ))}
        </div>
      ) : (
        <h1 className="text-center text-2xl mt-10">Loading...</h1>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg flex justify-between items-center">
        <span className="text-xl font-semibold">Total Price: ₹{total}</span>
        <button
          onClick={handlepurchase}
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
        >
          Proceed to Checkout
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/2">
            <h2 className="text-xl font-semibold mb-4">Edit Your Order</h2>
            {addedproduct.length > 0 ? (
              <>
                <ul>
                  {addedproduct.map((prod, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center mb-2"
                    >
                      <span>{productsmap[prod.product_id].name}</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleDecrement(prod.product_id)}
                          className="bg-gray-300 text-black px-2 rounded-md"
                        >
                          -
                        </button>
                        <span>{prod.quantity}</span>
                        <button
                          onClick={() => handleIncrement(prod.product_id)}
                          className="bg-gray-300 text-black px-2 rounded-md"
                        >
                          +
                        </button>
                        <button
                          onClick={() => handleRemoveProduct(prod.product_id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-md ml-2"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-lg">Total: ₹{total}</span>
                  <div className="flex space-x-4">
                    <button
                      onClick={handleCancel}
                      className="bg-gray-400 text-white px-4 py-2 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    >
                      Place Order
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <h3 className="text-center text-lg">Your cart is empty</h3>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Manu;
