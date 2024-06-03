import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  increment,
  query,
  where,
  collection,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "../../App";
import styles from "./singlePage.module.css";
import Comments from "../../components/comments/Comments";
import Menu from "../../components/Menu/Menu";

const getData = async (slug) => {
  try {
    const postRef = doc(db, "posts", slug);
    const postDoc = await getDoc(postRef);

    if (postDoc.exists()) {
      const viewedPosts = JSON.parse(
        localStorage.getItem("viewedPosts") || "{}"
      );
      if (!viewedPosts[slug]) {
        await updateDoc(postRef, { views: increment(0.5) });
        viewedPosts[slug] = true;
        localStorage.setItem("viewedPosts", JSON.stringify(viewedPosts));
      }

      const postData = postDoc.data();
      const authorUid = postData.uid;

      return {
        success: true,
        data: { id: postDoc.id, userId: authorUid, ...postData },
      };
    } else {
      return { success: false, message: "Post not found" };
    }
  } catch (error) {
    console.error("Error fetching post:", error);
    return { success: false, message: "Something went wrong" };
  }
};

const extractYouTubeVideoId = (url) => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const SinglePage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [authorProfile, setAuthorProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getData(id);
        if (result.success) {
          setData(result.data);
          const currentUser = auth.currentUser;
          if (currentUser) {
            setUserProfile(currentUser);
            const followerDocRef = doc(db, "followers", currentUser.uid);
            const followerDoc = await getDoc(followerDocRef);
            if (followerDoc.exists()) {
              const following = followerDoc.data().following || [];
              if (following.includes(result.data.userId)) {
                setIsFollowing(true);
              }
            }
          }

          // Fetch author profile using email from the post data
          const authorEmail = result.data.email;
          const usersQuery = query(
            collection(db, "users"),
            where("email", "==", authorEmail)
          );
          const querySnapshot = await getDocs(usersQuery);
          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              setAuthorProfile({
                displayName: doc.data().username,
                photoURL: doc.data().profilePictureUrl,
              });
            });
          }
        } else {
          setError(result.message);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [id]);

  const handleFollow = async () => {
    try {
      if (!userProfile || !data) return;

      const userId = data.userId;
      if (!userId) {
        console.error("User ID of the post author is undefined.");
        return;
      }

      const followerDocRef = doc(db, "followers", userProfile.uid);
      const followerDoc = await getDoc(followerDocRef);

      if (isFollowing) {
        // Unfollow
        if (followerDoc.exists()) {
          const followerData = followerDoc.data();
          const updatedFollowing = followerData.following.filter(
            (id) => id !== userId
          );

          const updatedDocData = {
            following: updatedFollowing,
          };
          console.log(
            "Updating document with data (unfollow):",
            updatedDocData
          );
          await updateDoc(followerDocRef, updatedDocData);
        }
        setIsFollowing(false);
        console.log("User unfollowed the author successfully.");
      } else {
        // Follow
        if (!followerDoc.exists()) {
          const newDocData = {
            following: [userId],
          };
          console.log("Creating new document with data (follow):", newDocData);
          await setDoc(followerDocRef, newDocData);
        } else {
          const followerData = followerDoc.data();
          const updatedFollowing = Array.isArray(followerData.following)
            ? [...new Set([...followerData.following, userId])]
            : [userId];

          const updatedDocData = {
            following: updatedFollowing.filter(Boolean),
          };
          console.log("Updating document with data (follow):", updatedDocData);
          await updateDoc(followerDocRef, updatedDocData);
        }
        setIsFollowing(true);
        console.log("User followed the author successfully.");
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data || !userProfile) {
    return <div>Loading...</div>;
  }

  const videoId = data.vid ? extractYouTubeVideoId(data.vid) : null;
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : null;

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>{data.title}</h1>
          <div className={styles.user}>
            {authorProfile && (
              <div className={styles.authorProfile}>
                <img
                  src={authorProfile.photoURL || "/defaultProfile.png"}
                  alt="Profile"
                  className={styles.profileImage}
                />
                <span className={styles.username}>
                  {authorProfile.displayName || "Anonymous"}
                </span>
              </div>
            )}
            {userProfile.uid !== data.userId && (
              <button
                className={`${styles.followButton} ${
                  isFollowing ? styles.unfollow : styles.follow
                }`}
                onClick={handleFollow}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>
          {embedUrl && (
            <div className={styles.videoContainer}>
              <iframe
                width="560"
                height="315"
                src={embedUrl}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Embedded youtube"
                className={styles.video}
              ></iframe>
            </div>
          )}
        </div>
        {data.img && (
          <div
            className={`${styles.imageContainer} ${styles.hideOnSmallScreen}`}
          >
            <img src={data.img} alt="" className={styles.image} />
          </div>
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.post}>
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: data.desc }}
          />
          <div className={styles.comment}>
            <Comments postSlug={id} />
          </div>
        </div>
        <Menu />
      </div>
    </div>
  );
};

export default SinglePage;
