// components/PDFViewer.js
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import fetchPDF from "../utils/fetchPDF"; // Adjust the path according to your structure

const PDFViewer = () => {
  const [pdfURL, setPdfURL] = useState("");
  const router = useRouter(); // Access the router object

  useEffect(() => {
    const { tid, cid, aid } = router.query; // Extract query parameters

    if (tid && cid && aid) {
      const pdfPath = `pdfs/Default_VerifyCertificate-aspx-tid=${tid}&cid=${cid}&aid=${aid}.pdf`; // Construct the PDF path

      const getPDF = async () => {
        const url = await fetchPDF(pdfPath); // Fetch the PDF URL
        if (url) {
          setPdfURL(url); // Set the PDF URL to state
        }
      };

      getPDF(); // Call the function to get the PDF
    } else {
      console.error("Missing parameters in the URL.");
    }
  }, [router.query]); // Run when router.query changes

  return (
    <div>
      {pdfURL ? (
        <iframe
          src={pdfURL}
          width="100%"
          height="670px"
          title="PDF Viewer"
          style={{ border: "none" }}
        />
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default PDFViewer;
