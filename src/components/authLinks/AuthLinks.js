import React, { useState, useEffect } from "react";
import styles from "./authLinks.module.css";
import { Link } from "react-router-dom"; // Import Link from React Router
import { auth } from "../../App";

const AuthLinks = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        // Handle logout success
      })
      .catch((error) => {
        // Handle logout failure
        console.error("Error signing out:", error);
      });
  };

  // Function to close the burger menu
  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <>
      {user ? (
        <>
          <Link to="/write" className={styles.link} onClick={closeMenu}>
            Write
          </Link>
          <span className={styles.link} onClick={handleLogout}>
            Logout
          </span>
        </>
      ) : (
        <Link to="/login" className={styles.link} onClick={closeMenu}>
          Login
        </Link>
      )}
      <div className={styles.burger} onClick={() => setOpen(!open)}>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
      </div>
      {open && (
        <div className={styles.responsiveMenu}>
          <Link to="/" onClick={closeMenu}>
            Homepage
          </Link>
          <Link to="/" onClick={closeMenu}>
            About
          </Link>
          <Link to="/" onClick={closeMenu}>
            Contact
          </Link>
          {user ? (
            <span className={styles.link} onClick={handleLogout}>
              Logout
            </span>
          ) : (
            <Link to="/login" onClick={closeMenu}>
              Login
            </Link>
          )}
        </div>
      )}
    </>
  );
};

export default AuthLinks;
