import React from "react";
import formatName from "../../utils/formatName";
import { staffIdToName } from "../../utils/staffIdToName";
import { staffIdToTitle } from "../../utils/staffIdToTitle";
import useAuth from "../../hooks/useAuth";
import { patientIdToName } from "../../utils/patientIdToName";
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
                author={
                  message.from_user_type === "staff"
                    ? formatName(
                        staffIdToName(clinic.staffInfos, message.from_id)
                      )
                    : patientIdToName(clinic.patientsInfos, message.from_id)
                }
                authorTitle={
                  message.from_user_type === "staff"
                    ? staffIdToTitle(clinic.staffInfos, message.from_id)
                    : ""
                }
                key={message.id}
                index={index + 1}
              />
            ))}
          <MessagesAttachments
            attachments={attachments}
            deletable={false}
            cardWidth="20%"
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
