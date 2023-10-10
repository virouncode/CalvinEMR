import React from "react";
import MessageExternalThumbnail from "./MessageExternalThumbnail";
import MessagesExternalOverviewToolbar from "./MessagesExternalOverviewToolbar";

const MessagesExternalOverview = ({
  messages,
  setMessages,
  setCurrentMsgId,
  msgsSelectedIds,
  setMsgsSelectedIds,
  section,
}) => {
  return (
    <>
      <MessagesExternalOverviewToolbar section={section} />
      {messages.map((message) => (
        <MessageExternalThumbnail
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

export default MessagesExternalOverview;