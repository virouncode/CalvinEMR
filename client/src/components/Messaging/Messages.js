import React, { useEffect, useState } from "react";
import MessagesToolBar from "./MessagesToolBar";
import MessagesLeftBar from "./MessagesLeftBar";
import MessagesBox from "./MessagesBox";
import axios from "../../api/xano";
import useAuth from "../../hooks/useAuth";

const Messages = () => {
  const { auth } = useAuth();
  const [search, setSearch] = useState("");
  const [section, setSection] = useState("Inbox");
  const [newVisible, setNewVisible] = useState(false);
  const [transferVisible, setTransferVisible] = useState(false);
  const [staffInfos, setStaffInfos] = useState(null);
  const [discussionsSelectedIds, setDiscussionsSelectedIds] = useState([]);
  const [currentDiscussionId, setCurrentDiscussionId] = useState(0);

  useEffect(() => {
    const fetchStaffInfos = async () => {
      const response = await axios.get("/staff", {
        headers: {
          Authorization: `Bearer ${auth?.authToken}`,
          "Content-Type": "application/json",
        },
      });
      setStaffInfos(response?.data);
    };
    fetchStaffInfos();
  }, [auth?.authToken]);

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
          staffInfos={staffInfos}
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
