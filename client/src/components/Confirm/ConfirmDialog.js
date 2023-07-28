import React from "react";
import logo from "../../assets/img/logo.png";

const ConfirmDialog = ({
  title,
  content,
  onConfirm,
  onCancel,
  containerStyle,
}) => {
  return (
    <>
      <div style={containerStyle}>
        <div className="confirm-dialog">
          <div className="confirm-dialog-header">
            <img src={logo} alt="alpha-emr-logo" width="100px" />
            <h2 style={{ fontSize: "1rem" }}>{title ?? "Confirmation"}</h2>
          </div>
          <p style={{ fontSize: "0.8rem", padding: "10px", margin: "0" }}>
            {content ?? "Do you really want to do this action ?"}
          </p>
          <p className="confirm-dialog-btn-container">
            <button type="button" onClick={onConfirm}>
              Yes
            </button>
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default ConfirmDialog;
