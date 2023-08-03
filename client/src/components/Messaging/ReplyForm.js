import React, { useState } from "react";
import formatName from "../../utils/formatName";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/xano";
import { toast } from "react-toastify";
import { filterAndSortDiscussions } from "../../utils/filterAndSortDiscussions";
import { staffIdToTitle } from "../../utils/staffIdToTitle";
import { staffIdToName } from "../../utils/staffIdToName";

const ReplyForm = ({
  setReplyVisible,
  allPersons,
  discussion,
  staffInfos,
  discussionMsgs,
  // setMessages,
  setDiscussions,
  section,
}) => {
  const { auth, user } = useAuth();
  const [body, setBody] = useState("");

  const handleCancel = (e) => {
    setReplyVisible(false);
  };
  const handleSend = async (e) => {
    const datas = {
      from_id: user.id,
      to_ids: allPersons
        ? discussion.participants_ids.filter((staff_id) => staff_id !== user.id)
        : discussionMsgs.slice(-1)[0].from_id,
      read_by_ids: [user.id],
      body: body,
      date_created: Date.parse(new Date()),
    };
    try {
      const response = await axios.post("/messages", datas, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      });

      const messageId = response.data.id;

      //discussion update
      await axios.put(
        `/discussions/${discussion.id}`,
        {
          ...discussion,
          messages_ids: [...discussion.messages_ids, messageId],
          date_updated: Date.parse(new Date()),
          replied: true,
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
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      });
      const newDiscussions = filterAndSortDiscussions(
        section,
        response2.data,
        user.id
      );
      setDiscussions(newDiscussions);
      setReplyVisible(false);
      toast.success("Message sent successfully", { containerId: "A" });
    } catch (err) {
      console.log(err);
      toast.error("Message couldn't be sent", { containerId: "A" });
    }
  };

  const handleChange = (e) => {
    setBody(e.target.value);
  };

  return (
    <div className="reply-form">
      <div className="reply-form-title">
        <p>
          To :{" "}
          {allPersons
            ? discussion.participants_ids
                .filter((staff_id) => staff_id !== user.id)
                .map(
                  (staff_id) =>
                    staffIdToTitle(staffInfos, staff_id) +
                    staffIdToName(staffInfos, staff_id)
                )
                .join(", ")
            : staffIdToTitle(staffInfos, discussionMsgs.slice(-1)[0].from_id) +
              staffIdToName(staffInfos, discussionMsgs.slice(-1)[0].from_id)}
        </p>
      </div>
      <div className="reply-form-body">
        <textarea value={body} onChange={handleChange}></textarea>
      </div>
      <div className="reply-form-btns">
        <button onClick={handleSend}>Send</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default ReplyForm;
