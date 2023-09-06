import React from "react";

const MessagesExternalOverviewToolbar = ({ section }) => {
  return (
    <div className="messages-overview-toolbar">
      <div className="messages-overview-toolbar-from-external">
        {section === "Sent messages" ? "To" : "From"}
      </div>
      <div className="messages-overview-toolbar-subject-external">
        Subject / Message overview
      </div>
      <div className="messages-overview-toolbar-date-external">Date</div>
    </div>
  );
};

export default MessagesExternalOverviewToolbar;
