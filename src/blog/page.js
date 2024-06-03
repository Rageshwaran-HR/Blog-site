import React from "react";
import CardList from "../components/cardList/CardList";
import styles from "./blogPage.module.css";
import Menu from "../components/Menu/Menu";
import { useLocation } from "react-router-dom";

const BlogPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const cat = searchParams.get("cat"); // Retrieve 'cat' from search parameters
  const page = parseInt(searchParams.get("page")) || 1;

  if (!cat) {
    return <div>Error: Invalid search parameters</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{cat} Blog</h1>
      <div className={styles.content}>
        <CardList page={page} cat={cat} />
        <Menu />
      </div>
    </div>
  );
};

export default BlogPage;
