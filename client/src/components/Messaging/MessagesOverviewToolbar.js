import React from "react";

const MessagesOverviewToolbar = ({ section }) => {
  return (
    <div className="messages-overview-toolbar">
      <div className="messages-overview-toolbar-from">
        {section === "Sent messages" ? "To" : "From"}
      </div>
      <div className="messages-overview-toolbar-subject">
        Subject / Message overview
      </div>
      <div className="messages-overview-toolbar-patient">Related patient</div>
      <div className="messages-overview-toolbar-date">Date</div>
    </div>
  );
};

export default MessagesOverviewToolbar;
