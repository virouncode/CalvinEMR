import React from "react";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/xano";

const MessagesToolBar = ({
  search,
  setSearch,
  newVisible,
  setNewVisible,
  section,
  setSection,
  discussionsSelectedIds,
  setDiscussionsSelectedIds,
}) => {
  const { auth } = useAuth();
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

  const handleClickMoveBack = async (e) => {
    if (!discussionsSelectedIds.length) {
      alert("Please choose at least one conversation");
      return;
    }
    const allDiscussionsSelected = (
      await axios.post(
        "/discussions_selected",
        { discussions_selected_ids: discussionsSelectedIds },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      )
    ).data;
    for (let discussion of allDiscussionsSelected) {
      const newDeletedByIds = discussion.deleted_by_ids.filter(
        (id) => id !== auth.userId
      );
      const newDiscussion = {
        ...discussion,
        deleted_by_ids: newDeletedByIds,
      };
      await axios.put(`/discussions/${discussion.id}`, newDiscussion, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      });
    }
    setSection("Inbox");
    setDiscussionsSelectedIds([]);
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
        <button>Select All</button>
        {section === "Deleted messages" && (
          <button onClick={handleClickMoveBack}>Move back to Inbox</button>
        )}
        <button>Print</button>
      </div>
    </div>
  );
};

export default MessagesToolBar;
