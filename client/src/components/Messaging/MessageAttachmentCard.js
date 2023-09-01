import React, { useState } from "react";
import NewWindow from "react-new-window";

const BASE_URL = "https://xsjk-1rpe-2jnw.n7c.xano.io";

const MessageAttachmentCard = ({
  handleRemoveAttachment,
  attachment,
  deletable,
  cardWidth = "30%",
}) => {
  const [popUpVisible, setPopUpVisible] = useState(false);
  const handleImgClick = () => {
    setPopUpVisible(true);
  };
  return (
    <>
      <div className="messages-attachments-card" style={{ width: cardWidth }}>
        <div className="messages-attachments-card-thumbnail">
          {attachment.file.mime.includes("image") ? (
            <img
              src={`${BASE_URL}${attachment.file.path}`}
              alt="attachment thumbnail"
              width="100%"
              onClick={handleImgClick}
            />
          ) : (
            <div>
              <iframe
                id="thumbnail-doc"
                title={attachment.alias}
                src={`${BASE_URL}${attachment.file.path}`}
                type={attachment.file.type}
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
        <div className="messages-attachments-card-footer">
          <p
            style={{
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              padding: "0",
            }}
          >
            {attachment.alias}
          </p>
          {deletable && (
            <i
              className="fa-solid fa-xmark"
              style={{ cursor: "pointer" }}
              onClick={() => handleRemoveAttachment(attachment.file.name)}
            ></i>
          )}
        </div>
      </div>
      {popUpVisible && (
        <NewWindow
          title={attachment.alias}
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
          {attachment.file.mime.includes("image") ? (
            <img
              src={`${BASE_URL}${attachment.file.path}`}
              alt=""
              width="100%"
            />
          ) : (
            <iframe
              title={attachment.aias}
              src={`${BASE_URL}${attachment.file.path}`}
              type={attachment.file.type}
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

export default MessageAttachmentCard;
