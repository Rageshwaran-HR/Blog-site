import { useState, useEffect } from "react";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { db } from "../App"; // Import your Firestore instance
import styles from "./loginPage.module.css";
import { collection, doc, setDoc } from "firebase/firestore";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const { uid, displayName, email, photoURL } = user;

        try {
          const userDocRef = doc(db, "users", uid);
          await setDoc(
            userDocRef,
            {
              username: displayName || email,
              email: email, // Add email field
              profilePictureUrl: photoURL || "/defaultProfile.png",
            },
            { merge: true }
          ); // Add merge option to update existing document
          console.log("User document updated in Firestore");
        } catch (error) {
          console.error("Error updating user document:", error);
        }
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      localStorage.setItem("email", user.email);
      navigate("/");
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setLoading(false);
    }
  };

  const signInWithGithub = async () => {
    setLoading(true);
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      localStorage.setItem("email", user.email);
      navigate("/");
    } catch (error) {
      console.error("Error signing in with GitHub:", error);
      setLoading(false);
    }
  };

  const signInWithFacebook = async () => {
    setLoading(true);
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      localStorage.setItem("email", user.email);
      navigate("/");
    } catch (error) {
      console.error("Error signing in with Facebook:", error);
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div
          className={styles.socialButton}
          onClick={signInWithGoogle}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in with Google"}
        </div>
        <div
          className={styles.socialButton}
          onClick={signInWithGithub}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in with Github"}
        </div>
        <div
          className={styles.socialButton}
          onClick={signInWithFacebook}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in with Facebook"}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
