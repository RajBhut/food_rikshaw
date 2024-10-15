import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Usercontext } from "./Userprovider";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Order() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/purchase/username`,
        {
          withCredentials: true,
        }
      );

      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const calculateTotal = (items = []) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Order History</h1>
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
                  {Array.isArray(order.items) && order.items.length > 0 ? (
                    order.items.map((item, i) => (
                      <li key={i}>
                        {item.name} (x{item.quantity}) - ₹{item.price}
                      </li>
                    ))
                  ) : (
                    <li>No items found for this order.</li>
                  )}
                </ul>

                <p className="mt-2 font-semibold">
                  Total: ₹{calculateTotal(order.items)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
