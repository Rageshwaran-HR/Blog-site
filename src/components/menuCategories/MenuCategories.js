import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../App"; // Adjust the path as needed
import styles from "./menuCategories.module.css";
import { Link } from "react-router-dom";

const MenuCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const fetchedCategories = [];
      querySnapshot.forEach((doc) => {
        const category = {
          id: doc.id,
          ...doc.data(),
        };
        fetchedCategories.push(category);
      });
      setCategories(fetchedCategories);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories: ", error);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const colors = shuffleArray([
    "#57c4ff31",
    "#da85c731",
    "#7fb88133",
    "#ff795736",
    "#ffb04f45",
    "#5e4fff31",
  ]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.categoryList}>
      {categories.map((category, index) => (
        <Link
          to={`/blog?cat=${category.slug}`}
          className={styles.categoryItem}
          style={{ backgroundColor: colors[index % colors.length] }}
        >
          {category.title}
        </Link>
      ))}
    </div>
  );
};

export default MenuCategories;
