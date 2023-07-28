import React, { useState } from "react";
import NewWindow from "react-new-window";

const BASE_URL = "https://xsjk-1rpe-2jnw.n7c.xano.io";

const AttachmentCard = ({ handleRemoveAttachment, file, deletable }) => {
  const [popUpVisible, setPopUpVisible] = useState(false);
  const handleImgClick = () => {
    setPopUpVisible(true);
  };
  return (
    <>
      <div className="progress-notes-attachments-card">
        <div className="progress-notes-attachments-card-thumbnail">
          {file.mime.includes("image") ? (
            <img
              src={`${BASE_URL}${file.path}`}
              alt="attachment thumbnail"
              width="100%"
              onClick={handleImgClick}
            />
          ) : (
            <div>
              <iframe
                id="thumbnail-doc"
                title={file.name}
                src={`${BASE_URL}${file.path}`}
                type={file.type}
                width="100%"
              />
              <div
                style={{
                  position: "absolute",
                  top: "0",
                  width: "100%",
                  height: "100%",
                  opacity: "0",
                  cursor: "pointer",
                }}
                onClick={handleImgClick}
              ></div>
            </div>
          )}
        </div>
        <div className="progress-notes-attachments-card-footer">
          <p
            style={{
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              padding: "0",
            }}
          >
            {file.name}
          </p>
          {deletable && (
            <i
              className="fa-solid fa-xmark"
              style={{ cursor: "pointer" }}
              onClick={() => handleRemoveAttachment(file.name)}
            ></i>
          )}
        </div>
      </div>
      {popUpVisible && (
        <NewWindow
          title={file.name}
          features={{
            toolbar: "no",
            scrollbars: "no",
            menubar: "no",
            status: "no",
            directories: "no",
            width: 800,
            height: 600,
            left: 320,
            top: 200,
          }}
          onUnload={() => setPopUpVisible(false)}
        >
          {file.mime.includes("image") ? (
            <img src={`${BASE_URL}${file.path}`} alt="" width="100%" />
          ) : (
            <iframe
              title={file.name}
              src={`${BASE_URL}${file.path}`}
              type={file.type}
              width="100%"
              height="100%"
              style={{ border: "none" }}
            />
          )}
        </NewWindow>
      )}
    </>
  );
};

export default AttachmentCard;
