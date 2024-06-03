import React from "react";
import { Link } from "react-router-dom";
import styles from "./footer.module.css";
import Youtube from "../../assets/youtube.png";
import logo from "../../assets/logo.png";
import instagram from "../../assets/instagram.png";
import tiktok from "../../assets/tiktok.png";
import facebook from "../../assets/facebook.png";

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <div className={styles.logo}>
          <img src={logo} alt="Altrusty" width={90} height={90} />
          <h1 className={styles.logoText}>StartUPSpotlight</h1>
        </div>
        <p className={styles.desc}>
          Discover inspiring stories, insights, and tips from startups around
          the world. Lamablog is your go-to source for the latest trends,
          innovations, and success stories in the startup ecosystem. Join us to
          explore the journeys of entrepreneurs and learn from their
          experiences.
        </p>
        <div className={styles.icons}>
          <img src={facebook} alt="Facebook" width={18} height={18} />
          <img src={instagram} alt="Instagram" width={18} height={18} />
          <img src={tiktok} alt="TikTok" width={18} height={18} />
          <img src={Youtube} alt="YouTube" width={18} height={18} />
        </div>
      </div>
      <div className={styles.links}>
        <div className={styles.list}>
          <span className={styles.listTitle}>Links</span>
          <Link to="/">Homepage</Link>
          <Link to="/Blog">Blog</Link>
          <Link to="/About">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className={styles.list}>
          <span className={styles.listTitle}>Tags</span>
          <Link to="/startups">startups</Link>
          <Link to="/Scholorships">Scholorships</Link>
          <Link to="/Techs">Techs</Link>
          <Link to="/News">News</Link>
        </div>
        <div className={styles.list}>
          <span className={styles.listTitle}>Social</span>
          <Link to="/">Facebook</Link>
          <Link to="/">Instagram</Link>
          <Link to="/">TikTok</Link>
          <Link to="/">YouTube</Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
