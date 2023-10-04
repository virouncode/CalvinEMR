import React from "react";
import useAuth from "../../../hooks/useAuth";
import { patientIdToName } from "../../../utils/patientIdToName";
import MessagesAttachments from "../MessagesAttachments";
import Message from "./Message";

const MessagesPrintPU = ({ message, previousMsgs, attachments }) => {
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
          <Message message={message} key={message.id} index={0} />
          {previousMsgs &&
            previousMsgs.map(
              (message, index) =>
                (message.type = "Internal" ? (
                  <Message
                    message={message}
                    key={message.id}
                    index={index + 1}
                  />
                ) : (
                  <Message
                    message={message}
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
