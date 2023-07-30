import React, { useEffect, useState } from "react";
import axios from "../../api/xano";
import useAuth from "../../hooks/useAuth";
import formatName from "../../utils/formatName";
import { NavLink } from "react-router-dom";
import { toLocalDateAndTime } from "../../utils/formatDates";

const DiscussionThumbnail = ({ discussion, messages }) => {
  const { auth } = useAuth();
  const [staffInfos, setStaffInfos] = useState(null);
  const [patient, setPatient] = useState({});
  console.log("discussion-thumbnail", discussion);
  console.log("messages", messages);

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

  useEffect(() => {
    const fetchPatient = async () => {
      const response = await axios.get(
        `patients/${discussion.related_patient_id}`,
        {
          headers: {
            Authorization: `Bearer ${auth?.authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("patient", response.data);
      setPatient(response.data);
    };
    fetchPatient();
  }, [auth?.authToken, discussion.related_patient_id]);

  return (
    staffInfos && (
      <div className="discussion-thumbnail">
        <input className="discussion-thumbnail-checkbox" type="checkbox" />
        <div className="discussion-thumbnail-persons">
          {formatName(
            staffInfos.find(({ id }) => id === messages[0].from_id).full_name
          )}
        </div>
        <div className="discussion-thumbnail-thumbnail">
          <span>{discussion.subject}</span> - {messages.slice(-1)[0].body}
        </div>
        <div className="discussion-thumbnail-patient">
          <NavLink
            to={`/patient-record/${patient.id}`}
            className="discussion-thumbnail-patient-link"
          >
            {patient.full_name}
          </NavLink>
        </div>
        <div className="discussion-thumbnail-date">
          {toLocalDateAndTime(messages.slice(-1)[0].date_created)}
        </div>
      </div>
    )
  );
};

export default DiscussionThumbnail;
