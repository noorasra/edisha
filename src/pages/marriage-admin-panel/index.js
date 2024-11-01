// pages/admin.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db, storage, auth } from "../../lib/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import styles from "../Default_VerifyCertificate-aspx/index.module.css";
import Popup from "@/components/Popup";
import Tags from "@/constants/tags";
import Layout from "@/components/layout/Layout";
import { getAuth } from "firebase/auth";
import { signOut } from "firebase/auth";

const AdminPanel = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [generatedURL, setGeneratedURL] = useState("");
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/"); // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [router, auth]);

  const [formData, setFormData] = useState({
    tid: "",
    cid: "",
    aid: "",
    tehsil: "",
    district: "",
    state: "",
    dateOfMarriage: "",
    placeOfMarriage: "",
    coupleImage: null, // Handle file upload
    brideName: "",
    brideDOB: "",
    brideFatherName: "",
    brideMotherName: "",
    bridePermanentAddress: "",
    bridegroomName: "",
    bridegroomDOB: "",
    bridegroomFatherName: "",
    bridegroomMotherName: "",
    bridegroomPermanentAddress: "",
    registrationNo: "",
    registrationDate: "",
    issuedByImage: null, // Handle file upload
    issuedbyname: "",
  });

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setFormData({
        ...formData,
        [e.target.name]: e.target.files[0],
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Disable the submit button to prevent multiple submissions
    if (isSubmitting) return; // Early return if already submitting
    setIsSubmitting(true); // Set to true when starting submission

    // Validation for tid, cid, and aid
    if (
      formData.tid.length !== 15 ||
      formData.cid.length !== 12 ||
      formData.aid.length !== 1
    ) {
      alert(
        "Invalid input! tid must be 15 characters, cid must be 12 characters, and aid must be 2 character."
      );
      setIsSubmitting(false); // Reset on validation failure
      return;
    }
    // Upload image files to Firebase Storage and get their URLs
    const uploadImage = (file, fieldName) => {
      return new Promise((resolve, reject) => {
        if (!file) {
          resolve(null);
          return;
        }
        const storageRef = ref(
          storage,
          `Default_VerifyCertificate/${file.name}`
        );
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress);
          },
          (error) => {
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    };

    try {
      // Upload images
      const coupleImageUrl = await uploadImage(
        formData.coupleImage,
        "coupleImage"
      );

      const issuedByImageUrl = await uploadImage(
        formData.issuedByImage,
        "issuedByImage"
      );

      // Add form data to Firestore, including image URLs
      await addDoc(collection(db, "marriageRegistrations"), {
        ...formData,
        coupleImage: coupleImageUrl,
        issuedByImage: issuedByImageUrl,
      });

      const url = `https://testing-mu-swart.vercel.app/Default_VerifyCertificate-aspx?tid=${formData.tid}&cid=${formData.cid}&aid=${formData.aid}`;
      setGeneratedURL(url);
      setPopupVisible(true);
      alert("Data successfully stored!");
      setFormData({
        tid: "",
        cid: "",
        aid: "",
        tehsil: "",
        district: "",
        state: "",
        dateOfMarriage: "",
        placeOfMarriage: "",
        coupleImage: null,
        brideName: "",
        brideDOB: "",
        brideFatherName: "",
        brideMotherName: "",
        bridePermanentAddress: "",
        bridegroomName: "",
        bridegroomDOB: "",
        bridegroomFatherName: "",
        bridegroomMotherName: "",
        bridegroomPermanentAddress: "",
        registrationNo: "",
        registrationDate: "",
        issuedByImage: null,
        issuedbyname: "",
      });
      document.querySelector("form").reset();
      router.push(
        `/pdf-viewer?tid=${formData.tid}&cid=${formData.cid}&aid=${formData.aid}`
      );
    } catch (error) {
      console.error("Error storing document: ", error);
    } finally {
      // Reset isSubmitting state regardless of success or failure
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("loginTime");
    router.push("/"); // Redirect to the login page
  };
  return (
    <Layout
      title={Tags.edishalogin.title}
      description={Tags.edishalogin.description}
    >
      <div
        className={`${styles.container_main} container px-2 px-md-5 bg-light rounded shadow-sm mt-1 pb-5`}
      >
        <h1 className="fs-4 text-center text-primary mb-2">
          Marriage Registration Certificate
        </h1>
        <form onSubmit={handleSubmit} className="needs-validation" noValidate>
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="tid" className="text-success">
                  TID
                </label>
                <input
                  type="text"
                  className="form-control border-primary"
                  id="tid"
                  name="tid"
                  value={formData.tid}
                  onChange={handleChange}
                  placeholder="Enter TID"
                  maxLength="15"
                  required
                />
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="cid" className="text-success">
                  CID
                </label>
                <input
                  type="text"
                  className="form-control border-primary"
                  id="cid"
                  name="cid"
                  value={formData.cid}
                  onChange={handleChange}
                  placeholder="Enter CID"
                  maxLength="12"
                  required
                />
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="aid" className="text-success">
                  AID
                </label>
                <input
                  type="text"
                  className="form-control border-primary"
                  id="aid"
                  name="aid"
                  value={formData.aid}
                  onChange={handleChange}
                  placeholder="Enter AID"
                  maxLength="1"
                  required
                />
              </div>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="tehsil" className="text-success">
                  Tehsil
                </label>
                <input
                  type="text"
                  className="form-control border-primary"
                  id="tehsil"
                  name="tehsil"
                  value={formData.tehsil}
                  onChange={handleChange}
                  placeholder="Enter Tehsil"
                  required
                />
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="district" className="text-success">
                  District
                </label>
                <input
                  type="text"
                  className="form-control border-primary"
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="Enter District"
                  required
                />
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="state" className="text-success">
                  State
                </label>
                <input
                  type="text"
                  className="form-control border-primary"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter State"
                  required
                />
              </div>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="dateOfMarriage" className="text-success">
                  Date of Marriage
                </label>
                <input
                  type="date"
                  className="form-control border-primary"
                  id="dateOfMarriage"
                  name="dateOfMarriage"
                  value={formData.dateOfMarriage}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="placeOfMarriage" className="text-success">
                  Place of Marriage
                </label>
                <input
                  type="text"
                  className="form-control border-primary"
                  id="placeOfMarriage"
                  name="placeOfMarriage"
                  value={formData.placeOfMarriage}
                  onChange={handleChange}
                  placeholder="Enter Place of Marriage"
                  required
                />
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="coupleImage" className="text-success">
                  Couple Image
                </label>{" "}
                <br />
                <input
                  type="file"
                  className="form-control-file border-primary"
                  id="coupleImage"
                  name="coupleImage"
                  accept="image/*"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <h2 className="text-danger mb-3">Bride Details</h2>
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="brideName" className="text-info">
                  Bride Name
                </label>
                <input
                  type="text"
                  className="form-control border-primary"
                  id="brideName"
                  name="brideName"
                  value={formData.brideName}
                  onChange={handleChange}
                  placeholder="Enter Bride Name"
                  required
                />
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="brideDOB" className="text-info">
                  Bride DOB
                </label>
                <input
                  type="date"
                  className="form-control border-primary"
                  id="brideDOB"
                  name="brideDOB"
                  value={formData.brideDOB}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="brideFatherName" className="text-info">
                  Bride Father Name
                </label>
                <input
                  type="text"
                  className="form-control border-primary"
                  id="brideFatherName"
                  name="brideFatherName"
                  value={formData.brideFatherName}
                  onChange={handleChange}
                  placeholder="Enter Bride Father Name"
                  required
                />
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="brideMotherName" className="text-info">
                  Bride Mother Name
                </label>
                <input
                  type="text"
                  className="form-control border-primary"
                  id="brideMotherName"
                  name="brideMotherName"
                  value={formData.brideMotherName}
                  onChange={handleChange}
                  placeholder="Enter Bride Mother Name"
                  required
                />
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="bridePermanentAddress" className="text-info">
                  Bride Permanent Address
                </label>
                <input
                  type="text"
                  className="form-control border-primary"
                  id="bridePermanentAddress"
                  name="bridePermanentAddress"
                  value={formData.bridePermanentAddress}
                  onChange={handleChange}
                  placeholder="Enter Bride Permanent Address"
                  required
                />
              </div>
            </div>
          </div>

          <h2 className="text-danger mb-3">Groom Details</h2>
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="bridegroomName" className="text-info">
                  Bride Groom Name
                </label>
                <input
                  type="text"
                  className="form-control border-primary"
                  id="bridegroomName"
                  name="bridegroomName"
                  value={formData.bridegroomName}
                  onChange={handleChange}
                  placeholder="Enter Bride Groom Name"
                  required
                />
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="bridegroomDOB" className="text-info">
                  Bride Groom DOB
                </label>
                <input
                  type="date"
                  className="form-control border-primary"
                  id="bridegroomDOB"
                  name="bridegroomDOB"
                  value={formData.bridegroomDOB}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="bridegroomFatherName" className="text-info">
                  Bride Groom Father Name
                </label>
                <input
                  type="text"
                  className="form-control border-primary"
                  id="bridegroomFatherName"
                  name="bridegroomFatherName"
                  value={formData.bridegroomFatherName}
                  onChange={handleChange}
                  placeholder="Enter Bride Groom Father Name"
                  required
                />
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="bridegroomMotherName" className="text-info">
                  Bride Groom Mother Name
                </label>
                <input
                  type="text"
                  className="form-control border-primary"
                  id="bridegroomMotherName"
                  name="bridegroomMotherName"
                  value={formData.bridegroomMotherName}
                  onChange={handleChange}
                  placeholder="Enter Bride Groom Mother Name"
                  required
                />
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label
                  htmlFor="bridegroomPermanentAddress"
                  className="text-info"
                >
                  Bride Groom Permanent Address
                </label>
                <input
                  type="text"
                  className="form-control border-primary"
                  id="bridegroomPermanentAddress"
                  name="bridegroomPermanentAddress"
                  value={formData.bridegroomPermanentAddress}
                  onChange={handleChange}
                  placeholder="Enter Bride Groom Permanent Address"
                  required
                />
              </div>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="registrationNo" className="text-primary">
                  Registration No
                </label>
                <input
                  type="text"
                  className="form-control border-primary"
                  id="registrationNo"
                  name="registrationNo"
                  value={formData.registrationNo}
                  onChange={handleChange}
                  placeholder="Enter Registration No"
                  required
                />
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="registrationDate" className="text-primary">
                  Registration Date
                </label>
                <input
                  type="date"
                  className="form-control border-primary"
                  id="registrationDate"
                  name="registrationDate"
                  value={formData.registrationDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-4 mt-2 mt-md-0">
              <div className="form-group">
                <label htmlFor="issuedByImage" className="text-primary">
                  Issued By Image
                </label>
                <input
                  type="file"
                  className="form-control-file border-primary"
                  id="issuedByImage"
                  name="issuedByImage"
                  accept="image/*"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group ">
              <label htmlFor="issuedbyname" className="text-info">
                Issued by name
              </label>
              <input
                type="text"
                className="form-control border-primary"
                id="issuedbyname"
                name="issuedbyname"
                value={formData.issuedbyname}
                onChange={handleChange}
                placeholder="Issued by name"
                required
              />
            </div>
          </div>
          <div className="text-center mt-2 mt-md-0">
            <button
              type="submit"
              className="btn btn-success"
              disabled={isSubmitting} // Disable button when submitting
            >
              {isSubmitting ? "Next..." : "Next"}
            </button>
            <button
              type="button"
              className="btn btn-danger mt-0 ms-2"
              onClick={handleLogout}
            >
              Logout
            </button>

            {progress > 0 && (
              <div className="progress mt-3">
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${progress}%` }}
                  aria-valuenow={progress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  {progress.toFixed(0)}%
                </div>
              </div>
            )}
          </div>
        </form>

        {isPopupVisible && (
          <Popup
            generatedURL={generatedURL}
            setPopupVisible={setPopupVisible}
          />
        )}
      </div>
    </Layout>
  );
};

export default AdminPanel;
