import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase.js";

export default async function handler(req, res) {
  try {
    const snapshot = await getDocs(collection(db, "tips"));

    const tips = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.status(200).json({
      ok: true,
      total: tips.length,
      tips
    });

  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
}