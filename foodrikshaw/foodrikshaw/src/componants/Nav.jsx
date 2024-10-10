// import React, { useContext, useEffect } from "react";
// import "./Nav.css";
// import { Link } from "react-router-dom";

// import { Usercontext } from "./Userprovider";
// import { useNavigate } from "react-router-dom";
// export default function Nav() {
//   const { user, setuser, isadmin } = useContext(Usercontext);

//   return (
//     <>
//       <nav>
//         <ul>
//           <Link to={"/"}>
//             <li>Home</li>
//           </Link>
//           <Link to={"/menu"}>
//             <li>Menu</li>
//           </Link>
//           {isadmin == true ? (
//             <Link to={"/admin"}>
//               <li>orders</li>
//             </Link>
//           ) : null}
//           <li>About</li>
//           <li onClick={() => setuser(null)}>Logout</li>
//           {user ? (
//             <li>{user.name}</li>
//           ) : (
//             <Link to={"/login"}>
//               <li>Login</li>
//             </Link>
//           )}
//         </ul>
//       </nav>
//     </>
//   );
// }
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Usercontext } from "./Userprovider";
import "./Nav.css";
export default function Nav() {
  const { user, setuser, isadmin } = useContext(Usercontext);

  return (
    <nav>
      <ul>
        <Link to={"/"}>
          <li>Home</li>
        </Link>
        <Link to={"/menu"}>
          <li>Menu</li>
        </Link>
        {/* Render Admin Tab based on the isadmin state */}
        {isadmin && (
          <Link to={"/admin"}>
            <li>Orders</li>
          </Link>
        )}
        <li>About</li>
        <li onClick={() => setuser(null)}>Logout</li>
        {/* Display User or Login */}
        {user ? (
          <li>{user.name}</li>
        ) : (
          <Link to={"/login"}>
            <li>Login</li>
          </Link>
        )}
      </ul>
    </nav>
  );
}
