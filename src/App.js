import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Home from "./Home";
import BlogPage from "./blog/page";
import Write from "./write/page";
import LoginPage from "./login/page";
import { ThemeContextProvider } from "./context/ThemeContext";
import ThemeProvider from "./provider/ThemeProvider";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import SinglePage from "./posts/[slug]/page"; // Correct import for SinglePage

const firebaseConfig = {
  apiKey: "AIzaSyAfWW4CHkzIT8GjbxSYNZ0elCEsaL-iJJY",
  authDomain: "altrusty-deebe.firebaseapp.com",
  projectId: "altrusty-deebe",
  storageBucket: "altrusty-deebe.appspot.com",
  messagingSenderId: "178519732667",
  appId: "1:178519732667:web:3fc9ea899e3a7fd85fd49e",
  measurementId: "G-MJ90X5NYE9",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

function App() {
  return (
    <Router>
      <ThemeContextProvider>
        <ThemeProvider>
          <div className="container">
            <div className="wrapper">
              <Navbar />
              <Routes>
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/write" element={<Write />} />
                <Route path="/posts/:id" element={<SinglePage />} />
                <Route path="/" element={<Home />} />
              </Routes>
              <Footer />
            </div>
          </div>
        </ThemeProvider>
      </ThemeContextProvider>
    </Router>
  );
}

export { App, auth, provider, db, storage };
