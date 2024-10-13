// import React, { useEffect, useState } from "react";
// import { useContext } from "react";
// import { Usercontext } from "./Userprovider";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// export default function Admin() {
//   const navigator = useNavigate();
//   const { isadmin } = useContext(Usercontext);
//   const [orders, setOrders] = useState([]);
//   const [toggle, setToggle] = useState("today");

//   useEffect(() => {
//     if (!isadmin) {
//       navigator("/");
//     } else {
//       fetchOrders();
//     }
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       const { data } = await axios.get(
//         `${import.meta.env.VITE_API_URL}/purchase/all`,
//         {
//           withCredentials: true,
//         }
//       );
//       console.log(data);
//       setOrders(data);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//     }
//   };

//   const filterOrders = () => {
//     const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

//     return toggle === "today"
//       ? orders.filter((order) => order?.date?.startsWith(today)) // Ensure order.date exists
//       : orders;
//   };

//   const handleOrderReady = (index) => {
//     const updatedOrders = [...orders];
//     updatedOrders[index].isReady = true;
//     setOrders(updatedOrders);
//   };

//   const calculateTotal = (items) => {
//     return items.reduce((total, item) => total + item.price * item.quantity, 0);
//   };

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold mb-6">Upcoming Orders</h1>

//       {/* Toggle Button */}
//       <div className="mb-4">
//         <button
//           className={`px-4 py-2 rounded ${
//             toggle === "today" ? "bg-blue-500 text-white" : "bg-gray-300"
//           }`}
//           onClick={() => setToggle("today")}
//         >
//           Today's Orders
//         </button>
//         <button
//           className={`ml-2 px-4 py-2 rounded ${
//             toggle === "all" ? "bg-blue-500 text-white" : "bg-gray-300"
//           }`}
//           onClick={() => setToggle("all")}
//         >
//           All Orders
//         </button>
//       </div>

//       {filterOrders().length === 0 ? (
//         <p>No orders found.</p>
//       ) : (
//         <div className="space-y-4">
//           {filterOrders().map((order, index) => (
//             <div
//               key={index}
//               className="border p-4 rounded-lg shadow-sm bg-white"
//             >
//               <h2 className="text-xl font-semibold">{order.name}</h2>
//               <p className="text-gray-600">Email: {order.email}</p>
//               <div className="mt-2">
//                 <h3 className="text-lg font-medium">Items:</h3>
//                 <ul className="list-disc list-inside">
//                   {order.items.map((item, i) => (
//                     <li key={i}>
//                       {item.name} (x{item.quantity}) - ₹{item.price}
//                     </li>
//                   ))}
//                 </ul>
//                 <p className="mt-2 font-semibold">
//                   Total: ₹{calculateTotal(order.items)}
//                 </p>
//               </div>
//               <button
//                 className={`mt-4 px-4 py-2 font-semibold text-white rounded ${
//                   order.isReady
//                     ? "bg-green-500"
//                     : "bg-blue-500 hover:bg-blue-600"
//                 }`}
//                 onClick={() => handleOrderReady(index)}
//                 disabled={order.isReady}
//               >
//                 {order.isReady ? "Order Ready" : "Mark as Ready"}
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Usercontext } from "./Userprovider";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Admin() {
  const navigator = useNavigate();
  const { isadmin } = useContext(Usercontext);
  const [orders, setOrders] = useState([]);
  const [toggle, setToggle] = useState("today");
  const [page, setPage] = useState(1); // For pagination
  const [totalPages, setTotalPages] = useState(1); // To store total pages

  useEffect(() => {
    if (!isadmin) {
      navigator("/");
    } else {
      fetchOrders(page); // Fetch orders for the current page
    }
  }, [page]); // Update orders when the page changes

  const fetchOrders = async (page = 1) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/purchase/all?page=${page}&limit=10`, // Sending page and limit to backend
        {
          withCredentials: true,
        }
      );
      setOrders(data.orders); // Update the orders state with fetched orders
      setTotalPages(data.totalPages); // Set the total number of pages for pagination
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const filterOrders = () => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    return toggle === "today"
      ? orders.filter((order) => order?.date?.startsWith(today)) // Ensure order.date exists
      : orders;
  };

  const handleOrderReady = (index) => {
    const updatedOrders = [...orders];
    updatedOrders[index].isReady = true;
    setOrders(updatedOrders);
  };

  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Upcoming Orders</h1>

      {/* Toggle Button */}
      <div className="mb-4">
        <button
          className={`px-4 py-2 rounded ${
            toggle === "today" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
          onClick={() => setToggle("today")}
        >
          Today's Orders
        </button>
        <button
          className={`ml-2 px-4 py-2 rounded ${
            toggle === "all" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
          onClick={() => setToggle("all")}
        >
          All Orders
        </button>
      </div>

      {filterOrders().length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {filterOrders().map((order, index) => (
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

      {/* Pagination Controls */}
      <div className="mt-8">
        <button
          className="px-4 py-2 bg-gray-300 rounded mr-2"
          onClick={() => setPage(page - 1)}
          disabled={page === 1} // Disable button if on the first page
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-gray-300 rounded ml-2"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages} // Disable button if on the last page
        >
          Next
        </button>
      </div>
    </div>
  );
}
