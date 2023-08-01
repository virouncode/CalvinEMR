import React, { useEffect, useState } from "react";
import formatName from "../../utils/formatName";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/xano";
import { toast } from "react-toastify";

const ReplyForm = ({
  setReplyVisible,
  allPersons,
  discussion,
  staffInfos,
  messages,
  setMessages,
  setDiscussions,
}) => {
  const { auth } = useAuth();
  const [lastAuthorId, setLastAuthor] = useState(discussion.staff_ids[0]);
  const [body, setBody] = useState("");

  useEffect(() => {
    let i = -1;
    while (messages.slice(i)[0].from_id === auth.userId) {
      i--;
    }
    setLastAuthor(messages.slice(i)[0].from_id);
  }, [auth.userId, messages]);

  const handleCancel = (e) => {
    setReplyVisible(false);
  };
  const handleSend = async (e) => {
    const datas = {
      from_id: auth.userId,
      to_ids: allPersons
        ? discussion.staff_ids.filter((staff_id) => staff_id !== auth.userId)
        : lastAuthorId,
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
      setMessages(
        response.data.sort(
          (a, b) => new Date(a.date_created) - new Date(b.date_created)
        )
      );
      //Change date of discussion update
      await axios.put(`/discussions/${discussion.id}`, {
        ...discussion,
        date_updated: Date.parse(new Date()),
      });
      const response2 = await axios.get(
        `/discussions?staff_id=${auth.userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth?.authToken}`,
          },
        }
      );
      setDiscussions(response2.data);
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
            ? discussion.staff_ids
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
                staffInfos.find(({ id }) => id === lastAuthorId).title ===
                "Doctor"
                  ? "Dr. "
                  : ""
              }` +
              formatName(
                staffInfos.find(({ id }) => id === lastAuthorId).full_name
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
