import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Popup = ({ generatedURL, setPopupVisible }) => {
  return (
    <div className="modal show" style={{ display: "block", opacity: 1 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header ">
            <h5 className="modal-title " >Generated URL</h5>
            
          </div>
          <div className="modal-body text-center">
            <p>You can access the details at the following URL:</p>
            <a
              href={generatedURL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-weight-bold text-primary"
            >
              {generatedURL}
            </a>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => setPopupVisible(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
