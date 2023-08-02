import React, { useEffect, useState } from "react";
import axios from "../../api/xano";
import useAuth from "../../hooks/useAuth";
import formatName from "../../utils/formatName";
import { NavLink } from "react-router-dom";
import { toLocalDateAndTime } from "../../utils/formatDates";
import { toast } from "react-toastify";
import { filterAndSortDiscussions } from "../../utils/filterAndSortDiscussions";

const DiscussionThumbnail = ({
  discussion,
  setDiscussions,
  messages,
  setCurrentDiscussionId,
  staffInfos,
  setMessages,
  setDiscussionsSelectedIds,
  discussionsSelectedIds,
  section,
}) => {
  const { setAuth, auth } = useAuth();
  const [patient, setPatient] = useState({});

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
      setPatient(response.data);
    };
    discussion.related_patient_id && fetchPatient();
  }, [auth?.authToken, discussion.related_patient_id]);

  const handleDiscussionClick = async (e) => {
    if (auth.unreadMessagesNbr !== 0) {
      const newUnreadMessagesNbr = auth.unreadMessagesNbr - 1;
      setAuth({ ...auth, unreadMessagesNbr: newUnreadMessagesNbr });
    }
    setCurrentDiscussionId(discussion.id);
    //all messages read by userId
    for (let message of messages) {
      if (!message.read_by_ids.includes(auth.userId)) {
        //create message to update
        const newMessage = {
          ...message,
          read_by_ids: [...message.read_by_ids, auth.userId],
        };
        await axios.put(`/messages/${message.id}`, newMessage, {
          headers: {
            Authorization: `Bearer ${auth?.authToken}`,
            "Content-Type": "application/json",
          },
        });
      }
    }
    //update messages
    const response = await axios.get(`/messages?staff_id=${auth.userId}`, {
      headers: {
        Authorization: `Bearer ${auth?.authToken}`,
        "Content-Type": "application/json",
      },
    });
    setMessages(response.data);
  };

  const THUMBNAIL_STYLE = {
    fontWeight: messages.slice(-1)[0].read_by_ids.includes(auth.userId)
      ? "normal"
      : "bold",
  };

  const handleCheckDiscussion = (e) => {
    const checked = e.target.checked;
    const id = e.target.id;
    if (checked) {
      if (!discussionsSelectedIds.includes(id)) {
        setDiscussionsSelectedIds([...discussionsSelectedIds, id]);
      }
    } else {
      let discussionsSelectedUpdated = [...discussionsSelectedIds];
      discussionsSelectedUpdated = discussionsSelectedUpdated.filter(
        (discussionId) => discussionId !== id
      );
      setDiscussionsSelectedIds(discussionsSelectedUpdated);
    }
  };

  const isDiscussionSelected = (id) => discussionsSelectedIds.includes(id);

  const handleDeleteDiscussion = async (e) => {
    try {
      await axios.put(
        `/discussions/${discussion.id}`,
        {
          ...discussion,
          deleted_by_ids: [...discussion.deleted_by_ids, auth.userId],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      );
      const response2 = await axios.get(
        `/discussions?staff_id=${auth.userId}`,
        {
          headers: {
            Authorization: `Bearer ${auth?.authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const newDiscussions = filterAndSortDiscussions(
        section,
        response2.data,
        auth.userId
      );
      setDiscussions(newDiscussions);
      toast.success("Discussion deleted successfully", { containerId: "A" });
    } catch (err) {
      console.log(err);
      toast.error("Couldn't delete discussion", { containerId: "A" });
    }
  };

  return (
    staffInfos && (
      <div className="discussion-thumbnail" style={THUMBNAIL_STYLE}>
        <input
          className="discussion-thumbnail-checkbox"
          type="checkbox"
          id={discussion.id}
          value={isDiscussionSelected(discussion.id)}
          onChange={handleCheckDiscussion}
        />
        <div
          onClick={handleDiscussionClick}
          className="discussion-thumbnail-link"
        >
          <div className="discussion-thumbnail-persons">
            {staffInfos.find(({ id }) => id === discussion.author_id).title ===
            "Doctor"
              ? "Dr. "
              : ""}
            {formatName(
              staffInfos.find(({ id }) => id === discussion.author_id).full_name
            )}
            ,{" "}
            {discussion.participants_ids
              .filter(
                (staff_id) =>
                  staff_id !== discussion.author_id &&
                  staff_id !== discussion.last_replier_id
              )
              .map(
                (staff_id) =>
                  (staffInfos.find(({ id }) => id === staff_id).title ===
                  "Doctor"
                    ? "Dr. "
                    : "") +
                  formatName(
                    staffInfos.find(({ id }) => id === staff_id).full_name
                  )
              )
              .join(" ,")}
            ,{" "}
            {discussion.last_replier_id !== 0 &&
              (staffInfos.find(({ id }) => id === discussion.last_replier_id)
                .title === "Doctor"
                ? "Dr. "
                : "") +
                formatName(
                  staffInfos.find(({ id }) => id === discussion.last_replier_id)
                    .full_name
                )}
          </div>
          <div className="discussion-thumbnail-sample">
            <span>{discussion.subject}</span> - {messages.slice(-1)[0].body}
          </div>
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
          {toLocalDateAndTime(discussion.date_updated)}
        </div>
        {section !== "Deleted messages" && (
          <i
            className="fa-solid fa-trash  discussion-detail-toolbar-trash"
            style={{ cursor: "pointer" }}
            onClick={handleDeleteDiscussion}
          ></i>
        )}
      </div>
    )
  );
};

export default DiscussionThumbnail;
