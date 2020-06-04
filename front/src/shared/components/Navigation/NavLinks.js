import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../context/auth-context";
import "./NavLinks.css";

const NavLinks = (props) => {
  const auth = useContext(AuthContext);

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>
          ALL USERS
        </NavLink>
      </li>
      {auth.isLoggedIn && (
      <li>
        <NavLink to={`/${auth.userId}/activities`}>MY ACTIVITIES</NavLink>
      </li>)}
      {auth.isLoggedIn && (
      <li>
        <NavLink to="/activities/new">ADD AN ACTIVITY</NavLink>
      </li>)}
      {auth.isLoggedIn && (
      <li>
        <NavLink to={`/${auth.userId}/profile`}>MY PROFILE</NavLink>
      </li>)}
      {!auth.isLoggedIn && (
      <li>
        <NavLink to="/login">AUTHENTICATE</NavLink>
      </li>)}
      {auth.isLoggedIn && (
        <button onClick={auth.logout}>LOGOUT</button>
      )}
    </ul>
  );
};

export default NavLinks;

//AUTHENTICATE POSE PB QUAND ON PASSE SUR LA PAGE REGISTER, N'EST PLUS SOULIGNÉ !!!!!!!!!!!!!!!
