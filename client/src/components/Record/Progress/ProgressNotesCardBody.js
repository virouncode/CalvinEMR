import React from "react";

const ProgressNotesCardBody = ({
  tempFormDatas,
  editVisible,
  handleChange,
}) => {
  return (
    <div className="progress-notes__card-body">
      {!editVisible ? (
        <p>{tempFormDatas.body}</p>
      ) : (
        <textarea
          name="body"
          cols="90"
          rows="20"
          value={tempFormDatas.body}
          onChange={handleChange}
        />
      )}
    </div>
  );
};

export default ProgressNotesCardBody;
