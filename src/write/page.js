import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
import { db, storage, auth } from "../App";
import PlusIcon from "../assets/plus.png";
import ImageIcon from "../assets/image.png";
import ExternalIcon from "../assets/external.png";
import VideoIcon from "../assets/video.png";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import styles from "./writePage.module.css";
import confetti from "canvas-confetti"; // Import canvas-confetti library

const WritePage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState("");
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [categories, setCategories] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const fetchedCategories = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (image) {
      const uploadImage = async () => {
        try {
          const name = new Date().getTime() + image.name;
          const storageRef = ref(storage, name);
          const uploadTask = uploadBytesResumable(storageRef, image);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + progress + "% done");
              switch (snapshot.state) {
                case "paused":
                  console.log("Upload is paused");
                  break;
                case "running":
                  console.log("Upload is running");
                  break;
                default:
                  console.log("Upload is in an unknown state");
                  break;
              }
            },
            (error) => {
              console.error("Upload error:", error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setImage(downloadURL);
              });
            }
          );
        } catch (error) {
          console.error("Error uploading image: ", error);
        }
      };
      uploadImage();
    }
  }, [image]);

  const handleSubmit = async () => {
    try {
      const postSlug = title.toLowerCase().replace(/\s+/g, "-");
      const postData = {
        title,
        desc: value,
        img: image,
        vid: video,
        slug: postSlug,
        catSlug: catSlug || "common",
        email: user.email,
        uid: user.uid, // Add the uid field with the value from User UID
        created: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
      };

      // Add the post to the "posts" collection
      await setDoc(doc(db, "posts", postSlug), postData);

      // Get all category documents
      const categorySnapshot = await getDocs(collection(db, "categories"));

      // Loop through each category document
      categorySnapshot.forEach(async (doc) => {
        const categoryData = doc.data();
        // Check if catSlug matches the slug field in the category document
        if (categoryData.slug === catSlug) {
          // Append postSlug to the posts array in the matching category document
          const updatedPosts = [...categoryData.posts, postSlug];
          await setDoc(doc.ref, { ...categoryData, posts: updatedPosts });
        }
      });

      // Trigger confetti effect
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      navigate(`/posts/${postSlug}`);
    } catch (e) {
      console.error("Error adding document:", e);
    }
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Title"
        className={styles.input}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <select
        className={styles.select}
        value={catSlug}
        onChange={(e) => setCatSlug(e.target.value)}
      >
        <option value="">Select Category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.slug}>
            {category.title}
          </option>
        ))}
      </select>
      <div className={styles.editor}>
        <button className={styles.button} onClick={() => setOpen(!open)}>
          <img src={PlusIcon} alt="Add" width={16} height={16} />
        </button>
        {open && (
          <div className={styles.add}>
            <label htmlFor="image">
              <input
                type="file"
                id="image"
                onChange={(e) => setImage(e.target.files[0])}
                style={{ display: "none" }}
              />
              <button className={styles.addButton}>
                <img src={ImageIcon} alt="Upload" width={16} height={16} />
              </button>
            </label>
            <button
              className={styles.addButton}
              onClick={() => {
                const url = prompt("Enter external link:");
                if (url) setVideo(url);
              }}
            >
              <img src={ExternalIcon} alt="External" width={16} height={16} />
            </button>
            <button
              className={styles.addButton}
              onClick={() => {
                const url = prompt("Enter video link:");
                if (url) setVideo(url);
              }}
            >
              <img src={VideoIcon} alt="Video" width={16} height={16} />
            </button>
          </div>
        )}
        <ReactQuill
          className={styles.textArea}
          theme="bubble"
          value={value}
          onChange={setValue}
          placeholder="Tell your story..."
        />
      </div>
      <button className={styles.publish} onClick={handleSubmit}>
        Publish
      </button>
    </div>
  );
};

export default WritePage;
