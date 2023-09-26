import React from "react";
import useAuth from "../../hooks/useAuth";
import MessagesAttachments from "./MessagesAttachments";
import MessageExternal from "./MessageExternal";

const MessagesExternalPrintPU = ({
  message,
  previousMsgs,
  author,
  authorTitle,
  attachments,
}) => {
  const { clinic } = useAuth();
  const handleClickPrint = (e) => {
    e.nativeEvent.view.print();
  };
  return (
    <div className="message-detail-print-container">
      <div className="message-detail-print">
        <div className="message-detail-print-title">
          <p className="message-detail-print-subject">
            <strong>Subject:{"\u00A0"}</strong>
            {message.subject}
          </p>
        </div>
        <div className="message-detail-content">
          <MessageExternal
            message={message}
            author={author}
            authorTitle={authorTitle}
            key={message.id}
            index={0}
          />
          {previousMsgs &&
            previousMsgs.map((message, index) => (
              <MessageExternal
                message={message}
                key={message.id}
                index={index + 1}
              />
            ))}
          <MessagesAttachments
            attachments={attachments}
            deletable={false}
            cardWidth="20%"
            addable={false}
          />
        </div>
        <div className="message-detail-print-btn">
          <button onClick={handleClickPrint}>Print</button>
        </div>
      </div>
    </div>
  );
};

export default MessagesExternalPrintPU;
