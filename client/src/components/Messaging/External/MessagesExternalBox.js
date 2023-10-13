import { CircularProgress } from "@mui/material";
import React from "react";
import FakeWindow from "../../Presentation/FakeWindow";
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
        <FakeWindow
          title="NEW MESSAGE"
          width={1000}
          height={600}
          x={(window.innerWidth - 1000) / 2}
          y={(window.innerHeight - 600) / 2}
          color={"#94bae8"}
          setPopUpVisible={setNewVisible}
        >
          <NewMessageExternal
            setNewVisible={setNewVisible}
            setMessages={setMessages}
            section={section}
          />
        </FakeWindow>
      )}
    </>
  );
};

export default MessagesExternalBox;
