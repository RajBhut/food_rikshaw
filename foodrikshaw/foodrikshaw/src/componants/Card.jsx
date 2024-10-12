import { useContext, useEffect, useState } from "react";
import "./card.css";
import axios from "axios";
import { PurchaseContext } from "./Purchaseprovider";
export default function Card({ name, price, imageUrl, tag, id }) {
  const [totalprice, setTotalprice] = useState(price);

  const [quantity, setQuantity] = useState(1);
  const { addedproduct, setaddedproduct, total, settotal } =
    useContext(PurchaseContext);

  const handleadd = () => {
    settotal((prevTotal) => {
      const newTotal = prevTotal + quantity * price;

      return newTotal;
    });

    setaddedproduct((prevProducts) => {
      const existingProductIndex = prevProducts.findIndex(
        (product) => product.id === id
      );
      if (existingProductIndex !== -1) {
        const updatedProducts = [...prevProducts];
        updatedProducts[existingProductIndex].quantity += quantity;
        add_to_cart(updatedProducts);

        return updatedProducts;
      } else {
        add_to_cart([...prevProducts, { product_id: id, quantity, price }]);
        return [...prevProducts, { product_id: id, quantity, price }];
      }
    });
  };

  const add_to_cart = async (product) => {
    const response = await axios.post(
      "https://food-rikshaw-64to.vercel.app/user/cart",

      product,
      { withCredentials: true }
    );
    console.log(response.data);
  };

  useEffect(() => {}, []);
  const incrementQuantity = () => {
    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity + 1;
      setTotalprice(price * newQuantity);
      return newQuantity;
    });
  };
  const decrementQuantity = () => {
    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity > 1 ? prevQuantity - 1 : 1;
      setTotalprice(price * newQuantity);
      return newQuantity;
    });
  };
  return (
    <div className=" overflow-hidden w-52 min-h-fit min-w-52  h-fit  p-1 max-w-fit min-h-fit border rounded-lg shadow-lg mx-3 my-5 ">
      <div className="p-4">
        <div className=" relative pt-2 min-h-[175px]">
          <img src={imageUrl} alt={name} className="object-cover rounded-md" />
          {tag && (
            <span className="absolute top-4 px-6 font-bold text-xs right-4 transform rotate-45 translate-x-1/2 -translate-y-1/2   px-2 py-1 rounded animate-gradient ">
              {tag}
            </span>
          )}
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-sm text-gray-600 mt-1">₹{totalprice.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2 p-2">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center border rounded-md">
            <button
              className="h-7 w-7 flex items-center justify-center bg-gray-200"
              onClick={decrementQuantity}
            >
              -
            </button>
            <span className="w-8 text-center">{quantity}</span>
            <button
              className="h-7 w-7 flex items-center justify-center bg-gray-200"
              onClick={incrementQuantity}
            >
              +
            </button>
          </div>
          <button
            onClick={handleadd}
            className=" w-fit h-fit bg-blue-500 text-white px-4 py-2  ml-2 rounded-md"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
