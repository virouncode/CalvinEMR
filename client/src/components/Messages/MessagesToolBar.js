import React from "react";

const MessagesToolBar = ({ search, setSearch }) => {
  const handleChange = (e) => {
    setSearch(e.target.value);
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
        className="fa-solid fa-magnifying-glass"
      ></i>
    </div>
  );
};

export default MessagesToolBar;
