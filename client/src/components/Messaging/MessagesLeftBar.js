import React from "react";
import useAuth from "../../hooks/useAuth";

const MessagesLeftBar = ({
  msgType,
  section,
  setSection,
  setCurrentMsgId,
  setMsgsSelectedIds,
  setSelectAllVisible,
}) => {
  const handleClickSection = (e) => {
    const name = e.target.id;
    setSection(name);
    setCurrentMsgId(0);
    setMsgsSelectedIds([]);
    setSelectAllVisible(true);
  };
  const isActive = (id) =>
    section === id
      ? "messages-content-leftbar-category messages-content-leftbar-category--active"
      : "messages-content-leftbar-category";

  const { user } = useAuth();

  return (
    <div className="messages-content-leftbar">
      <ul>
        <li
          className={isActive("Inbox")}
          id="Inbox"
          onClick={handleClickSection}
        >
          {msgType === "internal"
            ? "Inbox" +
              (user.unreadMessagesNbr ? ` (${user.unreadMessagesNbr})` : "")
            : "Inbox" +
              (user.unreadMessagesExternalNbr
                ? ` (${user.unreadMessagesExternalNbr})`
                : "")}
        </li>
        <li
          className={isActive("Sent messages")}
          id="Sent messages"
          onClick={handleClickSection}
        >
          Sent messages
        </li>
        <li
          className={isActive("Deleted messages")}
          id="Deleted messages"
          onClick={handleClickSection}
        >
          Deleted messages
        </li>
      </ul>
    </div>
  );
};

export default MessagesLeftBar;
