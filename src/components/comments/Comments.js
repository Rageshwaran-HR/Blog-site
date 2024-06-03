import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "../../App"; // Update the import path for your Firebase configuration
import styles from "./comments.module.css";

const Comments = ({ postSlug }) => {
  const [comments, setComments] = useState([]);
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      const q = query(
        collection(db, "comments"),
        where("postSlug", "==", postSlug),
        orderBy("createdAt", "desc")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedComments = [];
        snapshot.forEach((doc) => {
          fetchedComments.push({ id: doc.id, ...doc.data() });
        });
        setComments(fetchedComments);
        setLoading(false);
      });

      return unsubscribe;
    };

    fetchComments();
  }, [postSlug]);

  const handleSubmit = async () => {
    if (!desc.trim()) return;
    try {
      const user = auth.currentUser;
      const profileImageUrl = user.photoURL; // Assuming the profile image URL is stored in the photoURL field

      await addDoc(collection(db, "comments"), {
        desc,
        userEmail: user.email,
        userImage: profileImageUrl, // Include the profile image URL in the comment data
        postSlug,
        createdAt: new Date().toISOString(),
      });
      setDesc("");
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Comments</h1>
      <div className={styles.write}>
        <textarea
          placeholder="write a comment..."
          className={styles.input}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button className={styles.button} onClick={handleSubmit}>
          Send
        </button>
      </div>
      <div className={styles.comments}>
        {comments.map((comment) => (
          <div className={styles.comment} key={comment.id}>
            <div className={styles.user}>
              {comment.userImage && (
                <img
                  src={comment.userImage}
                  alt="Profile"
                  width={50}
                  height={50}
                  className={styles.image}
                />
              )}
              <div className={styles.userInfo}>
                <span className={styles.username}>{comment.userEmail}</span>
                <span className={styles.date}>{comment.createdAt}</span>
              </div>
            </div>
            <p className={styles.desc}>{comment.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
