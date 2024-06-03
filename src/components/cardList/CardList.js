import React, { useEffect, useState } from "react";
import styles from "./cardList.module.css";
import Pagination from "../pagination/Pagination";
import Card from "../card/Card";
import { collection, query, getDocs, where } from "firebase/firestore"; // Import Firestore functions
import { db } from "../../App"; // Import your Firebase app instance

const CardList = ({ cat }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Define the page state

  const POST_PER_PAGE = 5; // Number of posts per page

  const fetchData = async () => {
    try {
      let q;
      if (cat) {
        q = query(collection(db, "posts"), where("catSlug", "==", cat)); // Query for specific category
      } else {
        q = collection(db, "posts"); // Query for all posts if category is not specified
      }
      const querySnapshot = await getDocs(q);
      const fetchedPosts = [];
      querySnapshot.forEach((doc) => {
        fetchedPosts.push(doc.data());
      });
      setPosts(fetchedPosts);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [cat]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Calculate the start and end index of posts to display based on the current page
  const startIndex = (page - 1) * POST_PER_PAGE;
  const endIndex = startIndex + POST_PER_PAGE;

  // Get the subset of posts to display based on the calculated start and end index
  const displayedPosts = posts.slice(startIndex, endIndex);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Recent Posts</h1>
      <div className={styles.posts}>
        {displayedPosts.map((item, index) => (
          <Card item={item} key={index} />
        ))}
      </div>
      <Pagination
        page={page}
        totalPosts={posts.length}
        postsPerPage={POST_PER_PAGE}
        onPageChange={setPage} // Pass the setPage function to handle page changes
      />
    </div>
  );
};

export default CardList;
