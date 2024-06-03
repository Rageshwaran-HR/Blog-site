import React from "react";
import styles from "./navbar.module.css";
import Logo from "../../assets/OIP.jpg";

import { Link } from "react-router-dom";
import ThemeToggle from "../themeToggle/ThemeToggle";
import AuthLinks from "../authLinks/AuthLinks";

const Navbar = () => {
  return (
    <div className={styles.container}>
      <div className={styles.social}>
        <img src={Logo} alt="logo" width={150} height={100} />
      </div>
      <div className={styles.logo}>StartUPSpotlight</div>
      <div className={styles.links}>
        <ThemeToggle />
        <Link to="/" className={styles.link}>
          Homepage
        </Link>
        <Link to="/contact" className={styles.link}>
          Contact
        </Link>
        <Link to="/about" className={styles.link}>
          About
        </Link>
        <AuthLinks />
      </div>
    </div>
  );
};

export default Navbar;
