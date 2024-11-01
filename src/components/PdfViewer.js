// components/PDFViewer.js
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import fetchPDF from "../utils/fetchPDF"; // Adjust the path according to your structure

const PDFViewer = () => {
  const [pdfURL, setPdfURL] = useState("");
  const router = useRouter(); // Access the router object
  const [isMobile, setIsMobile] = useState(false);
  console.log(pdfURL, "pdf");

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

    // Check if the device is mobile
    setIsMobile(/Mobi|Android/i.test(navigator.userAgent));
  }, [router.query]); // Run when router.query changes

  return (
    <div>
      {isMobile ? (
        <object
          data={pdfURL}
          type="application/pdf"
          width="100%"
          height="670px"
          aria-label="PDF Viewer"
          style={{ border: "none" }}
        >
          <p>
            Your browser does not support PDFs.
            <a href={pdfURL}>Download the PDF</a>.
          </p>
        </object>
      ) : (
        <iframe
          src={pdfURL}
          width="100%"
          height="670px"
          title="PDF Viewer"
          style={{ border: "none" }}
        />
      )}
    </div>
  );
};

export default PDFViewer;
