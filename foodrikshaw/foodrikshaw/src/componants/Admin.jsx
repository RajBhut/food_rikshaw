import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Usercontext } from "./Userprovider";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Admin() {
  const navigator = useNavigate();
  const { isadmin } = useContext(Usercontext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!isadmin) {
      navigator("/");
    } else {
      fetchOrders();
    }
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(
        "https://food-rikshaw-3t6y-idnewf3k5-rajbhuts-projects.vercel.app/purchase/all",
        {
          withCredentials: true,
        }
      );
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleOrderReady = (index) => {
    const updatedOrders = [...orders];
    updatedOrders[index].isReady = true;
    setOrders(updatedOrders);
    // Optionally send the ready status to the backend
  };

  // Calculate the total for each order
  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Upcoming Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <div
              key={index}
              className="border p-4 rounded-lg shadow-sm bg-white"
            >
              <h2 className="text-xl font-semibold">{order.name}</h2>
              <p className="text-gray-600">Email: {order.email}</p>
              <div className="mt-2">
                <h3 className="text-lg font-medium">Items:</h3>
                <ul className="list-disc list-inside">
                  {order.items.map((item, i) => (
                    <li key={i}>
                      {item.name} (x{item.quantity}) - ₹{item.price}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 font-semibold">
                  Total: ₹{calculateTotal(order.items)}
                </p>
              </div>
              <button
                className={`mt-4 px-4 py-2 font-semibold text-white rounded ${
                  order.isReady
                    ? "bg-green-500"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
                onClick={() => handleOrderReady(index)}
                disabled={order.isReady}
              >
                {order.isReady ? "Order Ready" : "Mark as Ready"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
