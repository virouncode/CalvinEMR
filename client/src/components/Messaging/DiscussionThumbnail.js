import React, { useEffect, useState } from "react";
import axios from "../../api/xano";
import useAuth from "../../hooks/useAuth";
import { NavLink } from "react-router-dom";
import { toLocalDateAndTime } from "../../utils/formatDates";
import { toast } from "react-toastify";
import { filterAndSortDiscussions } from "../../utils/filterAndSortDiscussions";
import { staffIdToTitle } from "../../utils/staffIdToTitle";
import { staffIdToName } from "../../utils/staffIdToName";

const DiscussionThumbnail = ({
  discussion,
  setDiscussions,
  setCurrentDiscussionId,
  staffInfos,
  setDiscussionsSelectedIds,
  discussionsSelectedIds,
  section,
}) => {
  const { auth, user, setUser } = useAuth();
  const [patient, setPatient] = useState({});
  const [discussionMsgs, setDiscussionMsgs] = useState(null);

  useEffect(() => {
    const fetchDiscussionMsgs = async () => {
      const allDiscussionMsgs = (
        await axios.post(
          "/messages_selected",
          { messages_ids: discussion.messages_ids },
          {
            headers: {
              Authorization: `Bearer ${auth.authToken}`,
              "Content-Type": "application/json",
            },
          }
        )
      ).data;
      setDiscussionMsgs(
        allDiscussionMsgs
          .filter(
            (message) =>
              message.to_ids.includes(user.id) ||
              message.from_id === user.id ||
              message.transferred_to_ids.includes(user.id)
          )
          .sort((a, b) => a.date_created - b.date_created)
      );
    };
    fetchDiscussionMsgs();
  }, [auth.authToken, user.id, discussion.messages_ids]);

  useEffect(() => {
    const fetchPatient = async () => {
      const response = await axios.get(
        `patients/${discussion.related_patient_id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setPatient(response.data);
    };
    discussion.related_patient_id && fetchPatient();
  }, [auth.authToken, discussion.related_patient_id]);

  const handleDiscussionClick = async (e) => {
    //Remove one from the unread messages nbr counter
    if (user.unreadMessagesNbr !== 0) {
      const newUnreadMessagesNbr = user.unreadMessagesNbr - 1;
      setUser({ ...user, unreadMessagesNbr: newUnreadMessagesNbr });
    }
    setCurrentDiscussionId(discussion.id); //pour afficher les details de la discussion

    for (let message of discussionMsgs) {
      if (!message.read_by_ids.includes(user.id)) {
        //create and replace message with read by user id
        const newMessage = {
          ...message,
          read_by_ids: [...message.read_by_ids, user.id],
        };
        await axios.put(`/messages/${message.id}`, newMessage, {
          headers: {
            Authorization: `Bearer ${auth.authToken}`,
            "Content-Type": "application/json",
          },
        });
      }
    }
    // //update discussions
    // const response = await axios.get(`/discussions?staff_id=${user.id}`, {
    //   headers: {
    //     Authorization: `Bearer ${auth.authToken}`,
    //     "Content-Type": "application/json",
    //   },
    // });
    // const newDiscussions = filterAndSortDiscussions(
    //   section,
    //   response.data,
    //   user.id
    // );
    // setDiscussions(newDiscussions);
  };

  const THUMBNAIL_STYLE = {
    fontWeight: discussionMsgs?.find(
      (message) =>
        !message.read_by_ids.includes(user.id) &&
        message.to_ids.includes(user.id)
    )
      ? "bold"
      : "normal",
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
          deleted_by_ids: [...discussion.deleted_by_ids, user.id],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      );
      const response2 = await axios.get(`/discussions?staff_id=${user.id}`, {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
          "Content-Type": "application/json",
        },
      });
      const newDiscussions = filterAndSortDiscussions(
        section,
        response2.data,
        user.id
      );
      setDiscussions(newDiscussions);
      toast.success("Discussion deleted successfully", { containerId: "A" });
    } catch (err) {
      console.log(err);
      toast.error("Couldn't delete discussion", { containerId: "A" });
    }
  };

  return (
    staffInfos &&
    discussionMsgs && (
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
            {staffIdToTitle(staffInfos, discussion.author_id)}
            {staffIdToName(staffInfos, discussion.author_id)},{" "}
            {discussion.participants_ids
              .filter(
                (staff_id) =>
                  staff_id !== discussion.author_id &&
                  staff_id !== discussionMsgs.slice(-1)[0].from_id
              )
              .map(
                (staff_id) =>
                  staffIdToTitle(staffInfos, staff_id) +
                  staffIdToName(staffInfos, staff_id)
              )
              .join(" ,")}
            ,{" "}
            {discussionMsgs.slice(-1)[0].from_id !== discussion.author_id &&
              staffIdToTitle(staffInfos, discussionMsgs.slice(-1)[0].from_id) +
                staffIdToName(staffInfos, discussionMsgs.slice(-1)[0].from_id)}
          </div>
          <div className="discussion-thumbnail-sample">
            <span>{discussion.subject}</span> -{" "}
            {discussionMsgs.slice(-1)[0].body}
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
