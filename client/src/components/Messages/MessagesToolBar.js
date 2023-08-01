import React from "react";

const MessagesToolBar = ({ search, setSearch, newVisible, setNewVisible }) => {
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
      ></i>
      <div className="messages-toolbar-btns">
        <button onClick={handleClickNew}>New</button>
        <button>Select All</button>
      </div>
    </div>
  );
};

export default MessagesToolBar;
