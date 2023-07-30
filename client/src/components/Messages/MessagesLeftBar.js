import React from "react";

const MessagesLeftBar = () => {
  return (
    <div className="messages-section-leftbar">
      <ul>
        <li className="messages-section-leftbar-category messages-section-leftbar-category--active">
          Inbox
        </li>
        <li className="messages-section-leftbar-category">Sent messages</li>
        <li className="messages-section-leftbar-category">Deleted messages</li>
      </ul>
    </div>
  );
};

export default MessagesLeftBar;
