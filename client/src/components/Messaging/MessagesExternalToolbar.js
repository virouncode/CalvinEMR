import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import axiosXano from "../../api/xano";
import { toast } from "react-toastify";
import { confirmAlert } from "../Confirm/ConfirmGlobal";
import { filterAndSortExternalMessages } from "../../utils/filterAndSortExternalMessages";

const MessagesExternalToolBar = ({
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
  setPopUpVisible,
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
    if (
      await confirmAlert({
        content: "Do you really want to delete selected messages ?",
      })
    ) {
      try {
        for (let messageId of msgsSelectedIds) {
          const response = await axiosXano.get(
            `/messages_external/${messageId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.authToken}`,
              },
            }
          );
          const newMessage = {
            ...response.data,
            deleted_by_ids: [
              ...response.data.deleted_by_ids,
              { user_type: "staff", id: user.id },
            ],
          };
          await axiosXano.put(`/messages_external/${messageId}`, newMessage, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
          });
        }
        const response = await axiosXano.get(
          `/messages_external_for_staff?staff_id=${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${auth.authToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const newMessages = filterAndSortExternalMessages(
          section,
          response.data,
          "staff"
        );
        setMessages(newMessages);
        setNewVisible(false);
        toast.success("Message(s) deleted successfully", { containerId: "A" });
        setMsgsSelectedIds([]);
        setSelectAllVisible(true);
      } catch (err) {
        toast.error(`Error: unable to delete message(s): ${err.message}`, {
          containerId: "A",
        });
      }
    }
  };

  const handleClickMoveBack = async (e) => {
    try {
      const msgsSelected = (
        await axiosXano.post(
          "/messages_external_selected",
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
          (item) => item.user_type !== "staff"
        );
        const newMessage = {
          ...message,
          deleted_by_ids: newDeletedByIds,
        };
        await axiosXano.put(`/messages_external/${message.id}`, newMessage, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        });
      }
      setSection("Inbox");
      setMsgsSelectedIds([]);
      setSelectAllVisible(true);
      toast.success("Message(s) undeleted successfully", {
        containerId: "A",
      });
    } catch (err) {
      toast.error(`Error: unable to undelete message(s): ${err.message}`, {
        containerId: "A",
      });
    }
  };

  // const handleClickSearch = (e) => {};
  const handleClickPrint = () => {
    setPopUpVisible(true);
  };

  return (
    <div className="messages-toolbar">
      <p className="messages-toolbar-title">Messaging</p>
      <input
        type="text"
        placeholder="Search in messages"
        value={search}
        onChange={handleChange}
      />
      <div className="messages-toolbar-btns">
        <button onClick={handleClickNew}>New</button>
        {section === "Deleted messages" && msgsSelectedIds.length !== 0 && (
          <button onClick={handleClickMoveBack}>Undelete</button>
        )}
        {currentMsgId !== 0 && (
          <button onClick={handleClickPrint}>Print</button>
        )}
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

export default MessagesExternalToolBar;
