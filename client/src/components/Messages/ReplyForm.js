import React, { useState } from "react";
import formatName from "../../utils/formatName";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/xano";
import { toast } from "react-toastify";
import { filterAndSortDiscussions } from "../../utils/filterAndSortDiscussions";

const ReplyForm = ({
  setReplyVisible,
  allPersons,
  discussion,
  staffInfos,
  setMessages,
  setDiscussions,
  section,
}) => {
  const { auth } = useAuth();
  const [body, setBody] = useState("");

  const handleCancel = (e) => {
    setReplyVisible(false);
  };
  const handleSend = async (e) => {
    const datas = {
      from_id: auth.userId,
      to_ids: allPersons
        ? discussion.participants_ids.filter(
            (staff_id) => staff_id !== auth.userId
          )
        : [discussion.last_replier_id || discussion.author_id],
      read_by_ids: [auth.userId],
      date_created: Date.parse(new Date()),
      body: body,
      discussion_id: discussion.id,
    };
    try {
      await axios.post("/messages", datas, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      });
      const response = await axios.get(`/messages?staff_id=${auth.userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth?.authToken}`,
        },
      });
      //discussion update
      await axios.put(
        `/discussions/${discussion.id}`,
        {
          ...discussion,
          last_replier_id: auth.userId,
          date_updated: Date.parse(new Date()),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth?.authToken}`,
          },
        }
      );
      const response2 = await axios.get(
        `/discussions?staff_id=${auth.userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth?.authToken}`,
          },
        }
      );
      const newDiscussions = filterAndSortDiscussions(
        section,
        response2.data,
        auth.userId
      );
      setDiscussions(newDiscussions);
      setMessages(
        response.data.sort(
          (a, b) => new Date(a.date_created) - new Date(b.date_created)
        )
      );
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
                .filter((staff_id) => staff_id !== auth.userId)
                .map(
                  (staff_id) =>
                    `${
                      staffInfos.find(({ id }) => id === staff_id).title ===
                      "Doctor"
                        ? "Dr. "
                        : ""
                    }` +
                    formatName(
                      staffInfos.find(({ id }) => id === staff_id).full_name
                    )
                )
                .join(", ")
            : `${
                staffInfos.find(
                  ({ id }) =>
                    id === (discussion.last_replier_id || discussion.author_id)
                ).title === "Doctor"
                  ? "Dr. "
                  : ""
              }` +
              formatName(
                staffInfos.find(
                  ({ id }) =>
                    id === (discussion.last_replier_id || discussion.author_id)
                ).full_name
              )}
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
