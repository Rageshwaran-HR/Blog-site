import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore"; // Import Firestore functions
import { db } from "../../App"; // Import your Firebase app instance
import styles from "./categoryList.module.css";
import { Link } from "react-router-dom";

const getRandomColor = () => {
  const colors = [
    "#57c4ff31",
    "#da85c731",
    "#7fb88133",
    "#ff795736",
    "#ffb04f45",
    "#5e4fff31",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const CategoryList = () => {
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
          color: getRandomColor(),
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Popular Categories</h1>
      <div className={styles.categories}>
        {categories.map((category) => (
          <Link
            to={`/blog?cat=${category.slug}`}
            className={styles.category}
            key={category.id}
            style={{ backgroundColor: category.color }}
          >
            {category.img && (
              <img
                src={category.img}
                alt={category.title}
                width={32}
                height={32}
                className={styles.image}
              />
            )}
            {category.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
