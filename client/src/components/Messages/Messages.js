import React, { useEffect, useState } from "react";
import MessagesToolBar from "./MessagesToolBar";
import MessagesLeftBar from "./MessagesLeftBar";
import MessagesBox from "./MessagesBox";
import axios from "../../api/xano";
import useAuth from "../../hooks/useAuth";

const Messages = () => {
  const { auth } = useAuth();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Inbox");
  const [newVisible, setNewVisible] = useState(false);
  const [staffInfos, setStaffInfos] = useState(null);

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
      />
      <div className="messages-section">
        <MessagesLeftBar category={category} setCategory={setCategory} />
        <MessagesBox
          category={category}
          search={search}
          newVisible={newVisible}
          staffInfos={staffInfos}
          setNewVisible={setNewVisible}
        />
      </div>
    </div>
  );
};

export default Messages;
