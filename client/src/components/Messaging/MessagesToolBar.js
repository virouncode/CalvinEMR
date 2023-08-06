import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/xano";
import { filterAndSortMessages } from "../../utils/filterAndSortMessages";
import { toast } from "react-toastify";

const MessagesToolBar = ({
  search,
  setSearch,
  newVisible,
  setNewVisible,
  messages,
  setMessages,
  section,
  setSection,
  msgsSelectedIds,
  setMsgsSelectedIds,
  currentMsgId,
}) => {
  const { auth, user } = useAuth();
  const [selectAllVisible, setSelectAllVisible] = useState(true);
  const handleChange = (e) => {
    setSearch(e.target.value);
  };
  const handleClickNew = (e) => {
    if (newVisible) {
      alert(
        "You already opened a New Message window, please send your message or close the window"
      );
      return;
    }
    setNewVisible(true);
  };

  const handleSelectAll = () => {
    const allMessagesIds = messages.map(({ id }) => id);
    setMsgsSelectedIds(allMessagesIds);
    setSelectAllVisible(false);
  };

  const handleUnselectAll = () => {
    setMsgsSelectedIds([]);
    setSelectAllVisible(true);
  };

  const handleDeleteSelected = async () => {
    for (let messageId of msgsSelectedIds) {
      const response = await axios.get(`/messages/${messageId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      });
      const newMessage = {
        ...response.data,
        deleted_by_ids: [...response.data.deleted_by_ids, user.id],
      };
      await axios.put(`/messages/${messageId}`, newMessage, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      });
    }
    const response = await axios.get(`/messages?staff_id=${user.id}`, {
      headers: {
        Authorization: `Bearer ${auth.authToken}`,
        "Content-Type": "application/json",
      },
    });
    const newMessages = filterAndSortMessages(section, response.data, user.id);
    setMessages(newMessages);
    setNewVisible(false);
    toast.success("Message(s) deleted successfully", { containerId: "A" });
    setMsgsSelectedIds([]);
    setSelectAllVisible(true);
  };

  const handleClickMoveBack = async (e) => {
    const msgsSelected = (
      await axios.post(
        "/messages_selected",
        { messages_ids: msgsSelectedIds },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      )
    ).data;
    for (let message of msgsSelected) {
      const newDeletedByIds = message.deleted_by_ids.filter(
        (id) => id !== user.id
      );
      const newMessage = {
        ...message,
        deleted_by_ids: newDeletedByIds,
      };
      await axios.put(`/messages/${message.id}`, newMessage, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      });
    }
    setSection("Inbox");
    setMsgsSelectedIds([]);
    setSelectAllVisible(true);
  };

  const handleClickSearch = (e) => {};
  return (
    <div className="messages-toolbar">
      <p className="messages-toolbar-title">Messaging</p>
      <input
        type="text"
        placeholder="Search in messages"
        value={search}
        onChange={handleChange}
      />
      <i
        style={{ marginLeft: "10px", cursor: "pointer" }}
        className="fa-solid fa-magnifying-glass messages-toolbar-magnifying"
        onClick={handleClickSearch}
      ></i>
      <div className="messages-toolbar-btns">
        <button onClick={handleClickNew}>New</button>
        {section === "Deleted messages" && msgsSelectedIds.length !== 0 && (
          <button onClick={handleClickMoveBack}>Move back to Inbox</button>
        )}
        {currentMsgId !== 0 && <button>Print</button>}
        {section !== "Deleted messages" &&
          currentMsgId === 0 &&
          msgsSelectedIds.length !== 0 && (
            <button onClick={handleDeleteSelected}>Delete Selected</button>
          )}
        {currentMsgId === 0 &&
          (selectAllVisible ? (
            <button onClick={handleSelectAll}>Select All</button>
          ) : (
            <button onClick={handleUnselectAll}>Unselect All</button>
          ))}
      </div>
    </div>
  );
};

export default MessagesToolBar;
