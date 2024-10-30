// pages/api/fetchMarriageData.js
import { db } from "../../lib/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { tid, cid, aid } = req.query;

    // Log incoming parameters for debugging
    console.log("Incoming parameters:", { tid, cid, aid });

    // Validate that all required parameters are provided
    if (!tid || !cid || !aid) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    try {
      // Create a query to fetch documents that match the given tid, cid, and aid
      const q = query(
        collection(db, "marriageRegistrations"),
        where("tid", "==", tid),
        where("cid", "==", cid),
        where("aid", "==", aid)
      );

      // Fetch the matching documents
      const querySnapshot = await getDocs(q);

      // Check if any document was found
      if (querySnapshot.empty) {
        return res.status(404).json({ error: "No matching data found" });
      }

      // Store the matching document in an array
      const marriageRegistration = [];

      querySnapshot.forEach((doc) => {
        marriageRegistration.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      // Respond with the found document
      res.status(200).json({ marriageRegistration: marriageRegistration[0] });
    } catch (error) {
      // Log the error for debugging
      console.error("Error fetching data: ", error);
      res.status(500).json({ error: "Failed to fetch data" });
    }
  } else {
    // If the request method is not GET
    res.status(405).json({ error: "Method not allowed" });
  }
}
