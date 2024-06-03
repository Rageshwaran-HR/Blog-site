// categories/route.js
import { db } from "../../App";
import { collection, getDocs } from "firebase/firestore";

export const getCategories = async () => {
  try {
    const categoryRef = collection(db, "categories");
    const snapshot = await getDocs(categoryRef);
    const categories = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, data: categories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, message: "Something went wrong" };
  }
};
