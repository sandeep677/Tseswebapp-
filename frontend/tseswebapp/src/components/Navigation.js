"use client";

import { useState,useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import styles from "./navigation.module.css";
import axios from 'axios';
import verifyuser from '../context/authentication.js'

export default function Navigation() {
  const location = useLocation();
  const { user, login,logout} = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  
  
  async function cookieremove(){
    const response = await axios.get(
      "http://localhost:8000/logout",
      { withCredentials: true }
    );
    return response;
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.navContainer}>
        <Link to="/" className={styles.logo}>
          School App
        </Link>

        <button className={styles.menuButton} onClick={toggleMenu}>
          <span className={styles.menuIcon}></span>
        </button>

        <div className={`${styles.navLinks} ${menuOpen ? styles.active : ""}`}>
          <Link
            to="/"
            className={`${styles.navLink} ${location.pathname === "/" ? styles.active : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/notice"
            className={`${styles.navLink} ${location.pathname === "/notice" ? styles.active : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            Notice
          </Link>
          <Link
            to="/attendance"
            className={`${styles.navLink} ${location.pathname === "/attendance" ? styles.active : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            Attendance
          </Link>
          <Link
            to="/homework"
            className={`${styles.navLink} ${location.pathname === "/homework" ? styles.active : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            Homework
          </Link>

          {user ? (
            <div className={styles.userMenu}>
              <span className={styles.username}>{user.id}</span>
              <Link
                to="/change-password"
                className={`${styles.navLink} ${location.pathname === "/change-password" ? styles.active : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                Change Password
              </Link>
              <button className={styles.logoutButton} onClick={logout}>
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className={`${styles.navLink} ${location.pathname === "/login" ? styles.active : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}