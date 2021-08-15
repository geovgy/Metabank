import React from "react";
import { Redirect } from "react-router-dom";
import Dashboard  from "../pages";
import Authmiddleware from "./middleware/Authmiddleware";

// Authentication related pages
// import Login from "../pages/Authentication/Login";
// import Logout from "../pages/Authentication/Logout";
// import Register from "../pages/Authentication/Register";


const protectedRoutes = [
  // { path: "/dashboard", component: Dashboard },
  { path: "/", exact: true, component: Authmiddleware },
  // // this route should be at the end of all other routes
  // { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> },
];

const unprotectedRoutes = [
  // { path: "/logout", component: Logout },
  // { path: "/login", component: Login },
];

export { protectedRoutes, unprotectedRoutes };
