// import React, { useState, useEffect, useContext } from "react";
// import { useLocation } from "react-router-dom";
// import { PurchaseContext } from "./Purchaseprovider";
// import Card from "./Card";
// import axios from "axios";
// import "./menu.css"; // You can add custom styles if needed

// axios.defaults.withCredentials = true;

// const Manu = () => {
//   const location = useLocation();
//   const [selectedTab, setSelectedTab] = useState("lunch");
//   const { addedproduct, setaddedproduct, total, settotal } =
//     useContext(PurchaseContext);
//   const [lunch, setlunch] = useState([]);
//   const [dinner, setdinner] = useState([]);
//   const [products, setProducts] = useState();

//   const fetchData = async () => {
//     const response = await axios.get(
//       "https://food-rikshaw-64to.vercel.app/product"
//     );
//     setProducts(response.data);
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (products) {
//       products.map((product) => {
//         if (product.time === "lunch") setlunch((prev) => [...prev, product]);
//         else setdinner((prev) => [...prev, product]);
//       });
//     }
//   }, [products]);

//   useEffect(() => {
//     if (location.state && location.state.selectedTab) {
//       setSelectedTab(location.state.selectedTab);
//     }
//   }, [location]);

//   const handlepurchase = async () => {
//     try {
//       const res = await axios.post(
//         "https://food-rikshaw-64to.vercel.app/purchase/buy"
//       );
//       settotal(0);
//       setaddedproduct([]);
//     } catch (error) {
//       console.error("Error during purchase:", error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Tabs */}
//       <div className="tabs bg-gray-200 h-16 flex justify-center items-center space-x-8">
//         <button
//           className={`py-2 px-4 rounded-md ${
//             selectedTab === "lunch"
//               ? "bg-blue-500 text-white"
//               : "bg-gray-300 hover:bg-gray-400"
//           }`}
//           onClick={() => setSelectedTab("lunch")}
//         >
//           Lunch
//         </button>
//         <button
//           className={`py-2 px-4 rounded-md ${
//             selectedTab === "dinner"
//               ? "bg-blue-500 text-white"
//               : "bg-gray-300 hover:bg-gray-400"
//           }`}
//           onClick={() => setSelectedTab("dinner")}
//         >
//           Dinner
//         </button>
//       </div>

//       {/* Product Cards */}
//       {products ? (
//         <div className="container mx-auto py-8 px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {selectedTab === "lunch" && (
//             <>
//               {lunch.map((pro, index) => (
//                 <Card
//                   imageUrl={pro.img_url}
//                   className="card"
//                   id={pro._id}
//                   key={index}
//                   name={pro.name}
//                   price={pro.price}
//                 />
//               ))}
//             </>
//           )}
//           {selectedTab === "dinner" && (
//             <>
//               {dinner.map((pro, ind) => (
//                 <Card
//                   className="card"
//                   imageUrl={pro.img_url}
//                   id={pro._id}
//                   key={ind}
//                   name={pro.name}
//                   price={pro.price}
//                 />
//               ))}
//             </>
//           )}
//         </div>
//       ) : (
//         <h1 className="text-center text-2xl mt-10">Loading...</h1>
//       )}

//       {/* Total & Checkout */}
//       <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg flex justify-between items-center">
//         <span className="text-xl font-semibold">Total Price: ₹{total}</span>
//         <button
//           onClick={handlepurchase}
//           className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
//         >
//           Proceed to Checkout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Manu;
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
  const [showModal, setShowModal] = useState(false); // State for showing the modal

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://food-rikshaw-64to.vercel.app/product"
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
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
    setShowModal(true); // Show the modal when "Proceed to Checkout" is clicked
  };

  // Function to add product to the cart (with quantity initialized to 1)
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

  // Increment quantity
  const handleIncrement = (productId) => {
    const productToIncrement = addedproduct.find(
      (prod) => prod._id === productId
    );
    if (productToIncrement) {
      setaddedproduct((prev) =>
        prev.map((prod) =>
          prod._id === productId
            ? { ...prod, quantity: prod.quantity + 1 }
            : prod
        )
      );
      settotal((prev) => prev + productToIncrement.price);
    }
  };

  // Decrement quantity
  const handleDecrement = (productId) => {
    const productToDecrement = addedproduct.find(
      (prod) => prod._id === productId
    );
    if (productToDecrement && productToDecrement.quantity > 1) {
      setaddedproduct((prev) =>
        prev.map((prod) =>
          prod._id === productId
            ? { ...prod, quantity: prod.quantity - 1 }
            : prod
        )
      );
      settotal((prev) => prev - productToDecrement.price);
    } else if (productToDecrement.quantity === 1) {
      handleRemoveProduct(productId); // Remove the product if quantity is 1
    }
  };

  const handleRemoveProduct = (productId) => {
    const productToRemove = addedproduct.find((prod) => prod._id === productId);
    if (productToRemove) {
      setaddedproduct((prev) => prev.filter((prod) => prod._id !== productId));
      settotal(
        (prev) => prev - productToRemove.price * productToRemove.quantity
      );
    }
  };

  const handlePlaceOrder = async () => {
    try {
      await axios.post(
        "https://food-rikshaw-64to.vercel.app/purchase/buy",
        { products: addedproduct },
        { withCredentials: true }
      );
      settotal(0);
      setaddedproduct([]);
      setShowModal(false); // Close the modal after placing the order
    } catch (error) {
      console.error("Error placing the order:", error);
    }
  };

  // New function to handle cancel button
  const handleCancel = () => {
    setShowModal(false); // Close the modal without placing the order
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
                onClick={() => handleAddProduct(pro)} // Add to cart when clicked
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
                onClick={() => handleAddProduct(pro)} // Add to cart when clicked
              />
            ))}
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

      {/* Modal for editing order */}
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
                      <span>{productsmap[prod._id].name}</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleDecrement(prod._id)}
                          className="bg-gray-300 text-black px-2 rounded-md"
                        >
                          -
                        </button>
                        <span>{prod.quantity}</span>
                        <button
                          onClick={() => handleIncrement(prod._id)}
                          className="bg-gray-300 text-black px-2 rounded-md"
                        >
                          +
                        </button>
                        <button
                          onClick={() => handleRemoveProduct(prod._id)}
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
                      className="bg-gray-500 text-white px-4 py-2 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      className="bg-green-500 text-white px-4 py-2 rounded-md"
                    >
                      Place Order
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center">
                <p>Your cart is empty.</p>
                <button
                  onClick={handleCancel}
                  className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-md"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Manu;
