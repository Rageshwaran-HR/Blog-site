// comments/route.js
import { db } from "../../App";
import { collection, getDocs } from "firebase/firestore";

export const getComments = async () => {
  try {
    const commentRef = collection(db, "comments");
    const snapshot = await getDocs(commentRef);
    const comments = snapshot.docs.map((doc) => doc.data());

    return { success: true, data: comments };
  } catch (error) {
    console.error("Error fetching comments:", error);
    return { success: false, message: "Something went wrong" };
  }
};
