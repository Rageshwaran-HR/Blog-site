import React, { useEffect, useState } from "react";
import styles from "./featured.module.css";
import { db } from "../../App"; // Assuming you have a firebase configuration file
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { Link } from "react-router-dom";

const Featured = () => {
  const [topPost, setTopPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopPost = async () => {
      try {
        const q = query(
          collection(db, "posts"),
          orderBy("views", "desc"),
          limit(1)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const topPostData = querySnapshot.docs[0].data();
          setTopPost(topPostData);
        } else {
          setTopPost(null);
        }
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchTopPost();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Ensure created field exists and is a Firestore timestamp before calling toDate()
  const createdDate = topPost?.created?.toDate
    ? topPost.created.toDate()
    : null;

  // Truncate the description and ensure it doesn't break HTML structure
  const truncatedDesc =
    topPost?.desc?.substring(0, 200) +
    (topPost?.desc?.length > 200 ? "..." : "");

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <b>Hey, Starty Sprouts here!</b> Discover the stories and creative
        ideas.
      </h1>
      {topPost && (
        <div className={styles.post}>
          <div className={styles.imgContainer}>
            <img
              src={topPost.img}
              alt={topPost.title}
              className={styles.image}
            />
          </div>
          <div className={styles.textContainer}>
            <h1 className={styles.postTitle}>{topPost.title}</h1>
            <div className={styles.postDesc}>
              <div
                className={styles.desc}
                dangerouslySetInnerHTML={{ __html: truncatedDesc }}
              />
              {topPost.desc.length > 375 && <span>... read more</span>}
            </div>
            <Link to={`/posts/${topPost.slug}`} className={styles.link}>
              Read More
            </Link>
            {createdDate && (
              <div className={styles.date}>
                Published on: {createdDate.toDateString()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Featured;
