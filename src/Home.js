import React from "react";
import CardList from "./components/cardList/CardList";
import styles from "./Home.module.css";
import Menu from "./components/Menu/Menu";
import { useLocation } from "react-router-dom";
import Featured from "./components/featured/Featured";
import CategoryList from "./components/categoryList/CategoryList";

const BlogPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const cat = searchParams.get("category");
  const page = parseInt(searchParams.get("page")) || 1;

  // Check if there are no search parameters (root URL case)
  if (!cat && !location.search) {
    return (
      <div className={styles.container}>
        <Featured />
        <CategoryList />
        <div className={styles.content}>
          <CardList page={page} />
          <Menu />
        </div>
      </div>
    );
  }

  // Check for invalid category parameter
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
