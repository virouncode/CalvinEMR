import React from "react";

const ConfirmDialog = ({
  title,
  content,
  onConfirm,
  onCancel,
  containerStyle,
}) => {
  return (
    <>
      <div id="confirm-dialog" style={containerStyle}>
        <div className="confirm-dialog">
          <div className="confirm-dialog-header">
            <div className="confirm-dialog-header-logo"></div>
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
