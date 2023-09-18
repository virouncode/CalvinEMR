import React from "react";
import Message from "./Message";
import formatName from "../../utils/formatName";
import { staffIdToName } from "../../utils/staffIdToName";
import { staffIdToTitle } from "../../utils/staffIdToTitle";
import useAuth from "../../hooks/useAuth";
import { patientIdToName } from "../../utils/patientIdToName";
import MessagesAttachments from "./MessagesAttachments";

const MessagesPrintPU = ({
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
          {message.related_patient_id && (
            <p className="message-detail-print-patient">
              <strong>Patient:{"\u00A0"}</strong>
              {patientIdToName(
                clinic.patientsInfos,
                message.related_patient_id
              )}
            </p>
          )}
        </div>
        <div className="message-detail-content">
          <Message
            message={message}
            author={author}
            authorTitle={authorTitle}
            key={message.id}
            index={0}
          />
          {previousMsgs &&
            previousMsgs.map(
              (message, index) =>
                (message.type = "Internal" ? (
                  <Message
                    message={message}
                    author={formatName(
                      staffIdToName(clinic.staffInfos, message.from_id)
                    )}
                    authorTitle={staffIdToTitle(
                      clinic.staffInfos,
                      message.from_id
                    )}
                    key={message.id}
                    index={index + 1}
                  />
                ) : (
                  <Message
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
                ))
            )}
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

export default MessagesPrintPU;
