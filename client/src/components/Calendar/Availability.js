import React, { useState } from "react";
import NewWindow from "react-new-window";
import AvailabilityEditor from "./AvailabilityEditor";

const Availability = () => {
  const [editVisible, setEditVisible] = useState(false);
  const handleEdit = (e) => {
    setEditVisible((v) => !v);
  };
  return (
    <>
      <div className="availability">
        <label>Availability</label>
        <i
          onClick={handleEdit}
          style={{ cursor: "pointer" }}
          className="fa-regular fa-pen-to-square"
        ></i>
      </div>
      {editVisible && (
        <NewWindow
          title="Edit my availabilty"
          features={{
            toolbar: "no",
            scrollbars: "no",
            menubar: "no",
            status: "no",
            directories: "no",
            width: 1000,
            height: 350,
            left: 320,
            top: 200,
          }}
          onUnload={() => setEditVisible(false)}
        >
          <AvailabilityEditor setEditVisible={setEditVisible} />
        </NewWindow>
      )}
    </>
  );
};

export default Availability;
