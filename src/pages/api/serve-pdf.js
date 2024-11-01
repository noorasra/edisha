import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { firebaseConfig } from "../../lib/firebaseConfig"; // Adjust path if needed

// Initialize Firebase App and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req, res) {
  const { tid, cid, aid } = req.query;

  if (!tid || !cid || !aid) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
    // Build document reference based on `tid`, `cid`, and `aid` as the document ID.
    const pdfDocRef = doc(
      db,
      "pdfSubmissions",
      `tid=${tid}&cid=${cid}&aid=${aid}`
    );
    const pdfDoc = await getDoc(pdfDocRef);

    if (!pdfDoc.exists()) {
      return res.status(404).json({ error: "PDF not found" });
    }

    // Retrieve PDF URL from Firestore
    const pdfURL = pdfDoc.data().pdfUrl;

    // Redirect to the Firebase Storage URL
    res.redirect(pdfURL);
  } catch (error) {
    console.error("Error fetching PDF URL:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
