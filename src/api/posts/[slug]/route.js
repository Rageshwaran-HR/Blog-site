// posts/[slug]/route.js
import { db } from "../../App";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const getPostBySlug = async (slug) => {
  try {
    const postRef = doc(db, "posts", slug);
    const postDoc = await getDoc(postRef);

    if (postDoc.exists()) {
      await updateDoc(postRef);
      return { success: true, data: { id: postDoc.id, ...postDoc.data() } };
    } else {
      return { success: false, message: "Post not found" };
    }
  } catch (error) {
    console.error("Error fetching post:", error);
    return { success: false, message: "Something went wrong" };
  }
};
