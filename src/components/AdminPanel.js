// pages/admin.js
import { useState } from "react";
import { db, storage } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const AdminPanel = () => {
  console.log("Form Data: ", formData);
  const [formData, setFormData] = useState({
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
    qrCodeImage: null, // Handle file upload
    registrationNo: "",
    registrationDate: "",
    issuedByImage: null, // Handle file upload
  });

  const [progress, setProgress] = useState(0);

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

    // Upload image files to Firebase Storage and get their URLs
    const uploadImage = (file, fieldName) => {
      return new Promise((resolve, reject) => {
        if (!file) {
          resolve(null);
          return;
        }
        const storageRef = ref(storage, `images/${file.name}`);
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
      const qrCodeImageUrl = await uploadImage(
        formData.qrCodeImage,
        "qrCodeImage"
      );
      const issuedByImageUrl = await uploadImage(
        formData.issuedByImage,
        "issuedByImage"
      );

      // Add form data to Firestore, including image URLs
      await addDoc(collection(db, "marriageRegistrations"), {
        ...formData,
        coupleImage: coupleImageUrl,
        qrCodeImage: qrCodeImageUrl,
        issuedByImage: issuedByImageUrl,
      });

      alert("Data successfully stored!");
      setFormData({
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
        qrCodeImage: null,
        registrationNo: "",
        registrationDate: "",
        issuedByImage: null,
      });
    } catch (error) {
      console.error("Error storing document: ", error);
    }
  };

  return (
    <div className="">
      {/* <h1>Marriage Registration Form</h1> <br /> */}
      <div className="d-flex flex-column">
        <form onSubmit={handleSubmit} className=" ">
          <input
            type="text"
            name="tehsil"
            value={formData.tehsil}
            onChange={handleChange}
            placeholder="Tehsil"
            required
            className=""
          />
          <br />
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleChange}
            placeholder="District"
            required
          />
          <br />
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="State"
            required
          />
          <br />
          <input
            type="date"
            name="dateOfMarriage"
            value={formData.dateOfMarriage}
            onChange={handleChange}
            required
          />
          <br />
          <input
            type="text"
            name="placeOfMarriage"
            value={formData.placeOfMarriage}
            onChange={handleChange}
            placeholder="Place of Marriage"
            required
          />
          <br />
          {/* Upload Couple Image */}
          <input
            type="file"
            name="coupleImage"
            accept="image/*"
            onChange={handleChange}
            required
          />
          <br />
          <input
            type="text"
            name="brideName"
            value={formData.brideName}
            onChange={handleChange}
            placeholder="Bride Name"
            required
          />
          <br />
          <input
            type="date"
            name="brideDOB"
            value={formData.brideDOB}
            onChange={handleChange}
            required
          />
          <br />
          <input
            type="text"
            name="brideFatherName"
            value={formData.brideFatherName}
            onChange={handleChange}
            placeholder="Bride Father Name"
            required
          />
          <br />
          <input
            type="text"
            name="brideMotherName"
            value={formData.brideMotherName}
            onChange={handleChange}
            placeholder="Bride Mother Name"
            required
          />
          <br />
          <input
            type="text"
            name="bridePermanentAddress"
            value={formData.bridePermanentAddress}
            onChange={handleChange}
            placeholder="Bride Permanent Address"
            required
          />
          <br />
          <input
            type="text"
            name="bridegroomName"
            value={formData.bridegroomName}
            onChange={handleChange}
            placeholder="Bridegroom Name"
            required
          />
          <br />
          <input
            type="date"
            name="bridegroomDOB"
            value={formData.bridegroomDOB}
            onChange={handleChange}
            required
          />
          <br />
          <input
            type="text"
            name="bridegroomFatherName"
            value={formData.bridegroomFatherName}
            onChange={handleChange}
            placeholder="Bridegroom Father Name"
            required
          />
          <br />
          <input
            type="text"
            name="bridegroomMotherName"
            value={formData.bridegroomMotherName}
            onChange={handleChange}
            placeholder="Bridegroom Mother Name"
            required
          />
          <br />
          <input
            type="text"
            name="bridegroomPermanentAddress"
            value={formData.bridegroomPermanentAddress}
            onChange={handleChange}
            placeholder="Bridegroom Permanent Address"
            required
          />
          <br />
          {/* Upload QR Code Image */}
          <input
            type="file"
            name="qrCodeImage"
            accept="image/*"
            onChange={handleChange}
            required
          />
          <br />
          <input
            type="text"
            name="registrationNo"
            value={formData.registrationNo}
            onChange={handleChange}
            placeholder="Registration No"
            required
          />
          <br />
          <input
            type="date"
            name="registrationDate"
            value={formData.registrationDate}
            onChange={handleChange}
            required
          />
          <br />
          {/* Upload Issued By Image */}
          <input
            type="file"
            name="issuedByImage"
            accept="image/*"
            onChange={handleChange}
            required
          />
          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
      <p>Upload Progress: {progress}%</p>
    </div>
  );
};

export default AdminPanel;
