import React, { useEffect, useState } from "react";
import styles from "./menuPosts.module.css";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../App";
import { format } from "date-fns";
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

const MenuPosts = ({ withImage }) => {
  const [topPosts, setTopPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState({});

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const categoriesData = {};
      querySnapshot.forEach((doc) => {
        categoriesData[doc.id] = {
          title: doc.data().title,
          color: getRandomColor(),
        };
      });
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories: ", error);
    }
  };

  const fetchTopPosts = async () => {
    try {
      const q = query(
        collection(db, "posts"),
        orderBy("views", "desc"),
        limit(3) // Change the limit to 2
      );
      const querySnapshot = await getDocs(q);
      const topPostsData = [];
      querySnapshot.forEach((doc) => {
        const post = { id: doc.id, ...doc.data() };
        if (post.created && post.created.toDate instanceof Function) {
          post.date = format(post.created.toDate(), "MMMM dd, yyyy");
        } else {
          post.date = "Unknown date";
        }
        topPostsData.push(post);
      });
      setTopPosts(topPostsData);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTopPosts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className={styles.items}>
      {topPosts.map((post) => (
        <Link to={`/posts/${post.slug}`} className={styles.item} key={post.id}>
          {withImage && post.img && (
            <div className={styles.imageContainer}>
              <img src={post.img} alt={post.title} className={styles.image} />
            </div>
          )}
          <div className={styles.textContainer}>
            <span
              className={styles.category}
              style={{
                backgroundColor:
                  categories[post.catSlug]?.color || getRandomColor(),
              }}
            >
              {categories[post.catSlug]?.title || post.catSlug}
            </span>
            <h3 className={styles.postTitle}>{post.title}</h3>
            <div className={styles.detail}>
              <span className={styles.date}> - {post.date}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default MenuPosts;
