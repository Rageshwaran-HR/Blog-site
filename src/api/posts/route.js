// posts/route.js
import { db, storage } from "../../App";
import { addDoc, collection } from "firebase/firestore";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";

export const createPost = async (postData) => {
  try {
    const { file, ...data } = postData;

    const storageRef = ref(storage, `posts/${file.name}`);
    await uploadBytes(storageRef, file);

    const downloadURL = await getDownloadURL(storageRef);

    const postRef = collection(db, "posts");
    await addDoc(postRef, { ...data, imageUrl: downloadURL });

    return { success: true, message: "Post created successfully" };
  } catch (error) {
    console.error("Error creating post:", error);
    return { success: false, message: "Something went wrong" };
  }
};
