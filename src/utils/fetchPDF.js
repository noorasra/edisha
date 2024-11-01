// utils/fetchPDF.js
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../lib/firebaseConfig"; // Adjust the path according to your structure

const fetchPDF = async (pdfPath) => {
  try {
    const pdfRef = ref(storage, pdfPath); // Create a reference to the PDF
    const url = await getDownloadURL(pdfRef); // Get the download URL
    return url; // Return the URL
  } catch (error) {
    console.error("Error fetching PDF:", error);
    return null; // Return null on error
  }
};

export default fetchPDF;
