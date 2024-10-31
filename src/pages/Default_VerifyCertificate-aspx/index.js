import { useState, useEffect } from "react";
import { useRouter } from "next/router"; // Import useRouter
import Image from "next/image";
import styles from "./index.module.css";
import React, { useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { QRCodeCanvas } from "qrcode.react";
import Popup from "@/components/Popup";
import { firestore, storage, db } from "../../lib/firebaseConfig";
const MarriageDataList = () => {
  const router = useRouter();
  const { tid, cid, aid } = router.query;
  const [marriageData, setMarriageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const barcodeRef = useRef(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  const generatePDF = () => {
    const input = document.getElementById("pdf-content");

    html2canvas(input, { scale: 1 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();

      const imgWidth = 150;
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf?.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("Default_VerifyCertificate.pdf");
      const pdfBlob = pdf.output("blob");
      const pdfURL = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfURL);
      window.open(pdfURL, "_blank");
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (tid && cid && aid) {
        try {
          const response = await fetch(
            `/api/fetchMarriageData?tid=${tid}&cid=${cid}&aid=${aid}`
          );
          const data = await response.json();
          const fetchedData = data?.marriageRegistration
            ? [data.marriageRegistration]
            : [];
          setMarriageData(fetchedData);
          setLoading(false);
          if (fetchedData.length > 0) {
            generatePDF();
          }
        } catch (error) {
          console.error("Error fetching data: ", error);
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [tid, cid, aid]);

  useEffect(() => {
    const metaTag = document.createElement("meta");
    metaTag.name = "viewport";
    metaTag.content = "width=1100px, initial-scale=1";
    document.head.appendChild(metaTag);

    return () => {
      document.head.removeChild(metaTag);
    };
  }, []);

  const filteredData = marriageData?.filter(
    (item) =>
      item.brideName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.bridegroomName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (barcodeRef.current && tid && cid && aid) {
      const url = `https://yourwebsite.com/verify?tid=${tid}&cid=${cid}&aid=${aid}`;
      JsBarcode(barcodeRef.current, url, {
        format: "CODE128",
        width: 2,
        height: 50,
        displayValue: true,
      });
    }
  }, [tid, cid, aid]);

  //   if (loading) return <p>Loading...</p>;

  const formatDate = (dateString) => {
    return dateString.replace(/^(\d{4})-(\d{2})-(\d{2})$/, "$3-$2-$1");
  };

  const renderNamesWithLineBreaks = (nameString) => {
    return nameString.split(",").map((name, index) => (
      <span key={index}>
        {name.trim()}
        {index < nameString.split(",").length - 1 && (
          <>
            ,<br />
          </>
        )}{" "}
      </span>
    ));
  };
  return (
    <>
      <button onClick={generatePDF} className="btn btn-primary">
        Download Certificate
      </button>
      <div className={styles.fixedContainer}>
        <div className={styles.scaledContent}>
          <div id="pdf-content" className={styles.pdfContent}>
            {filteredData?.map((item) => (
              <div className={`${styles.main_card} relative `}>
                <div class={styles.text_absolute}>
                  <span className={styles.edisha}>eDisHa</span>
                  <span
                    className="bg-transparent pe-2 ps-1"
                    style={{ border: "2px solid", marginLeft: "1px" }}
                  >
                    {item.tid}
                  </span>
                </div>
                <div className="d-flex justify-content-center mt-5">
                  <p className={`${styles.record} mb-0`}>
                    This is to certify that the following is an extract from the
                    registration of the marriage record with Tehsil{" "}
                    <span className="fw-bold text-capitalize">
                      {item.tehsil}
                    </span>
                    , District -{" "}
                    <span className="fw-bold text-capitalize">
                      {item.district}
                    </span>{" "}
                    of state{" "}
                    <span className="fw-bold text-capitalize">
                      {item.state}
                    </span>{" "}
                    (INDIA).
                  </p>
                </div>
                <div
                  className={`${styles.main_content} d-flex justify-content-between px-5 mx-5`}
                  // style={{ border: "1px solid red" }}
                >
                  <div className="mt-4">
                    <p className="fw-bold">
                      Date of Marriage:{" "}
                      <span className={`${styles.date_m} ms-2 fw-normal`}>
                        {" "}
                        {formatDate(item.dateOfMarriage)}
                      </span>{" "}
                    </p>
                    <p className={`${styles.address_place} fw-bold`}>
                      Place of Marriage:{" "}
                      <span
                        className={`${styles.address} ms-2 text-uppercase fw-normal`}
                      >
                        {item.placeOfMarriage}
                      </span>
                    </p>
                  </div>

                  <div className="me-5">
                    <Image
                      src={item.coupleImage}
                      width={230}
                      height={130}
                      alt="sign_img"
                      className=""
                    />
                  </div>
                </div>
                <div className={`${styles.content}`}>
                  <div className="d-flex justify-content-between ">
                    <div className="fw-bold mb-0 text-capitalize">
                      Bride Name:{" "}
                      <span className="fw-bold">{item.brideName}</span>{" "}
                    </div>
                    <div className="fw-bold mb-0 ">
                      Date of Birth:{" "}
                      <span className="fw-normal">
                        {formatDate(item.brideDOB)}
                      </span>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between ">
                    <p className="fw-bold mb-0 text-capitalize">
                      Father's Name:{" "}
                      <span className="fw-normal">{item.brideFatherName}</span>
                    </p>
                    <p className="fw-bold mb-0 text-capitalize">
                      Mother's Name:{" "}
                      <span className="fw-normal">{item.brideMotherName}</span>
                    </p>
                  </div>
                  <div className="d-flex justify-content-between ">
                    <p className="fw-bold mb-0">
                      Permanent Address:{" "}
                      <span className="fw-normal text-uppercase">
                        {item.bridePermanentAddress}
                      </span>
                    </p>
                  </div>
                </div>

                <div className={`${styles.content} mt-2  `}>
                  <div className="d-flex justify-content-between ">
                    <p className="fw-bold mb-0 text-capitalize">
                      Bridegroom Name:{" "}
                      <span className="fw-bold">{item.bridegroomName}</span>{" "}
                    </p>
                    <p className="fw-bold mb-0">
                      Date of Birth:{" "}
                      <span className="fw-normal">
                        {" "}
                        {formatDate(item.bridegroomDOB)}
                      </span>{" "}
                    </p>
                  </div>
                  <div className="d-flex justify-content-between ">
                    <p className="fw-bold mb-0 text-capitalize">
                      Father's Name:{" "}
                      <span className="fw-normal">
                        {item.bridegroomFatherName}
                      </span>{" "}
                    </p>
                    <p className="fw-bold mb-0 text-capitalize">
                      Mother's Name:{" "}
                      <span className="fw-normal">
                        {item.bridegroomMotherName}
                      </span>{" "}
                    </p>
                  </div>
                  <div className="d-flex ">
                    <p className="fw-bold mb-0">
                      Permanent Address:{" "}
                      <span className="fw-normal text-uppercase">
                        {item.bridegroomPermanentAddress}
                      </span>
                    </p>
                  </div>
                </div>
                <div
                  className={`${styles.content_bottom} d-flex justify-content-between px-5 mx-5 mt-2`}
                >
                  <div className="d-flex align-items-center gap-3">
                    <QRCodeCanvas
                      value={`https://testing-mu-swart.vercel.app/Default_VerifyCertificate-aspx?tid=${tid}&cid=${cid}&aid=${aid}`}
                      size={150}
                      level={"H"}
                      includeMargin={true}
                    />
                    <div>
                      <p className="fw-bold mb-0">
                        Registration No.: {item.registrationNo}{" "}
                      </p>
                      <p className="fw-bold mb-0">
                        Registration Date: {formatDate(item.registrationDate)}
                      </p>
                    </div>
                  </div>
                  <div
                    className="d-flex flex-column gap-2 text-end"
                    style={{ position: "relative" }}
                  >
                    <p className="fw-bold">Issued by:</p>

                    <Image
                      src={item.issuedByImage}
                      width={150}
                      height={60}
                      alt="sign_img"
                      style={{
                        position: "absolute",
                        bottom: "35%",
                        right: "0%",
                        zIndex: 1,
                      }}
                    />
                    <p
                      className="fw-bolder text-capitalize text-end mt-3"
                      style={{ position: "relative", zIndex: "10" }}
                    >
                      {renderNamesWithLineBreaks(item.issuedbyname)}
                    </p>
                  </div>
                </div>

                <div className={` text-center  d-flex justify-content-center `}>
                  <p
                    className="mb-0 "
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                      borderTop: "1.5px solid ",
                    }}
                  >
                    This is computer generated certificate and can be verified
                    at http://edisha.gov.in
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MarriageDataList;
