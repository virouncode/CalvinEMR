//Libraries
import React, { useEffect, useState } from "react";
//Components
import MessagesToolBar from "./MessagesToolBar";
import MessagesLeftBar from "./MessagesLeftBar";
import MessagesBox from "./MessagesBox";
//Utils
import useAuth from "../../hooks/useAuth";

const Messages = () => {
  //HOOKS
  const { clinic } = useAuth();
  const [search, setSearch] = useState("");
  const [section, setSection] = useState("Inbox");
  const [newVisible, setNewVisible] = useState(false);
  const [transferVisible, setTransferVisible] = useState(false);
  const [discussionsSelectedIds, setDiscussionsSelectedIds] = useState([]);
  const [currentDiscussionId, setCurrentDiscussionId] = useState(0);

  return (
    <div className="messages-container">
      <MessagesToolBar
        search={search}
        setSearch={setSearch}
        newVisible={newVisible}
        setNewVisible={setNewVisible}
        section={section}
        setSection={setSection}
        discussionsSelectedIds={discussionsSelectedIds}
        setDiscussionsSelectedIds={setDiscussionsSelectedIds}
      />
      <div className="messages-section">
        <MessagesLeftBar
          section={section}
          setSection={setSection}
          setCurrentDiscussionId={setCurrentDiscussionId}
        />
        <MessagesBox
          section={section}
          search={search}
          newVisible={newVisible}
          staffInfos={clinic.staffInfos}
          setNewVisible={setNewVisible}
          setSection={setSection}
          discussionsSelectedIds={discussionsSelectedIds}
          setDiscussionsSelectedIds={setDiscussionsSelectedIds}
          currentDiscussionId={currentDiscussionId}
          setCurrentDiscussionId={setCurrentDiscussionId}
          transferVisible={transferVisible}
          setTransferVisible={setTransferVisible}
        />
      </div>
    </div>
  );
};

export default Messages;
