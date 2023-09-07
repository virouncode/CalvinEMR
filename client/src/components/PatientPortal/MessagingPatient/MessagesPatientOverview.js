import React from "react";
import MessagesPatientOverviewToolbar from "./MessagesPatientOverviewToolbar";
import MessagePatientThumbnail from "./MessagePatientThumbnail";

const MessagesPatientOverview = ({
  messages,
  setMessages,
  setCurrentMsgId,
  msgsSelectedIds,
  setMsgsSelectedIds,
  section,
}) => {
  return (
    <>
      <MessagesPatientOverviewToolbar section={section} />
      {messages.map((message) => (
        <MessagePatientThumbnail
          key={message.id}
          message={message}
          setMessages={setMessages}
          setCurrentMsgId={setCurrentMsgId}
          setMsgsSelectedIds={setMsgsSelectedIds}
          msgsSelectedIds={msgsSelectedIds}
          section={section}
        />
      ))}
    </>
  );
};

export default MessagesPatientOverview;
