import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export const testConnection = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "events"));
    console.log("Firestore connected! Found:", querySnapshot.size, "documents.");
    querySnapshot.forEach(doc => console.log(doc.id, "=>", doc.data()));
  } catch (error) {
    console.error("Error connecting to Firestore:", error);
  }
};
