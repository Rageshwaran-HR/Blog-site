import React, { useContext } from "react";
import styles from "./themeToggle.module.css";
import moonIcon from "../../assets/moon.png";
import sunIcon from "../../assets/sun.png";
import { ThemeContext } from "../../context/ThemeContext";

const ThemeToggle = () => {
  const { toggle, theme } = useContext(ThemeContext);

  return (
    <div
      className={styles.container}
      onClick={toggle}
      style={
        theme === "dark"
          ? { backgroundColor: "white" }
          : { backgroundColor: "#0f172a" }
      }
    >
      <img src={moonIcon} alt="" width={14} height={14} />
      <div
        className={styles.ball}
        style={
          theme === "dark"
            ? { left: 1, background: "#0f172a" }
            : { right: 1, background: "white" }
        }
      ></div>
      <img src={sunIcon} alt="" width={14} height={14} />
    </div>
  );
};

export default ThemeToggle;
