import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PurchaseContext } from "./Purchaseprovider";
import { Usercontext } from "./Userprovider";
import axios from "axios";
import Card from "./Card";
import "./home.css";

export default function Home() {
  const {
    addedproduct,
    setaddedproduct,
    total,
    settotal,
    first_fetch,
    setfirstfetch,
  } = useContext(PurchaseContext);
  const navigate = useNavigate();
  const { user, setuser, isadmin, setisadmin } = useContext(Usercontext);

  const getprofile = async () => {
    try {
      const response = await axios.get(
        "https://food-rikshaw-3t6y-idnewf3k5-rajbhuts-projects.vercel.app/user/profile",
        {
          withCredentials: true,
        }
      );

      if (response.data) {
        setuser(response.data[0]);

        setisadmin(response.data[1].admin);
      }
    } catch (error) {
      console.log("error", error);
      if (error.response && error.response.status === 401) {
        console.log("Unauthorized access - redirecting to login");
        navigate("/login");
      } else {
        console.log("An unexpected error occurred:", error);
      }
    }
  };

  const fetch_cart = async () => {
    try {
      const data = await axios.get(
        "https://food-rikshaw-3t6y-idnewf3k5-rajbhuts-projects.vercel.app/user/cart",
        {
          withCredentials: true,
        }
      );

      if (data && first_fetch) {
        setaddedproduct(data.data);

        data.data.map((pro) => {
          settotal((prevTotal) => {
            const newTotal = prevTotal + pro.quantity * pro.price;
            return newTotal;
          });
        });
        setfirstfetch(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getprofile();
    fetch_cart();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center">
          <div className="Logo mb-6">
            <img src="/Designer.png" alt="Logo" className="w-48 h-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <Link
              to={"/menu"}
              state={{ selectedTab: "lunch" }}
              className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src="/aluu.png"
                alt="Lunch Special"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black opacity-25"></div>
              <span className="absolute bottom-4 left-4 text-white font-bold text-lg">
                Lunch Menu
              </span>
            </Link>

            <Link
              to={"/menu"}
              state={{ selectedTab: "dinner" }}
              className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src="/sev_tam.jpg"
                alt="Dinner Special"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black opacity-25"></div>
              <span className="absolute bottom-4 left-4 text-white font-bold text-lg">
                Dinner Menu
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card
              name="Alu Sabji"
              price={25}
              tag="Lunch Special"
              imageUrl="/aluu.png"
            />
            <Card
              name="Sev Tamatar"
              price={25}
              tag="Dinner Special"
              imageUrl="/sev_tam.jpg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
