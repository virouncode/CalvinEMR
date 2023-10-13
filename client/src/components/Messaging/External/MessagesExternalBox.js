import { CircularProgress } from "@mui/material";
import React from "react";
import NewWindow from "react-new-window";
import MessageExternalDetail from "./MessageExternalDetail";
import MessagesExternalOverview from "./MessagesExternalOverview";
import NewMessageExternal from "./NewMessageExternal";

const MessagesExternalBox = ({
  section,
  newVisible,
  setNewVisible,
  setSection,
  msgsSelectedIds,
  setMsgsSelectedIds,
  currentMsgId,
  setCurrentMsgId,
  messages,
  setMessages,
  popUpVisible,
  setPopUpVisible,
}) => {
  const emptySectionMessages = (sectionName) => {
    switch (sectionName) {
      case "Inbox":
        return `No inbox external messages`;
      case "Sent messages":
        return `No sent external messages`;
      case "Deleted messages":
        return `No deleted external messages`;
      default:
        break;
    }
  };

  return (
    <>
      <div className="messages-content-box">
        {messages ? (
          messages?.length !== 0 ? (
            currentMsgId === 0 ? (
              <MessagesExternalOverview
                messages={messages}
                setMessages={setMessages}
                setCurrentMsgId={setCurrentMsgId}
                msgsSelectedIds={msgsSelectedIds}
                setMsgsSelectedIds={setMsgsSelectedIds}
                section={section}
              />
            ) : (
              <MessageExternalDetail
                setCurrentMsgId={setCurrentMsgId}
                message={messages.find(({ id }) => id === currentMsgId)}
                setMessages={setMessages}
                setSection={setSection}
                section={section}
                popUpVisible={popUpVisible}
                setPopUpVisible={setPopUpVisible}
              />
            )
          ) : (
            <p>{emptySectionMessages(section)}</p>
          )
        ) : (
          <CircularProgress />
        )}
      </div>
      {newVisible && (
        <NewWindow
          title="New Message"
          features={{
            toolbar: "no",
            scrollbars: "no",
            menubar: "no",
            status: "no",
            directories: "no",
            width: 1000,
            height: 500,
            left: 0,
            top: 0,
          }}
          onUnload={() => setNewVisible(false)}
        >
          <NewMessageExternal
            setNewVisible={setNewVisible}
            setMessages={setMessages}
            section={section}
          />
        </NewWindow>
      )}
    </>
  );
};

export default MessagesExternalBox;
