import React, { useEffect, useState } from "react";
import axios from "../../api/xano";
import useAuth from "../../hooks/useAuth";
import Discussion from "./DiscussionThumbnail";

const MessagesBox = ({ category, search }) => {
  const { auth } = useAuth();
  const [discussions, setDiscussions] = useState(null);
  const [messages, setMessages] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await axios.get(`/messages?staff_id=${auth.userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth?.authToken}`,
        },
      });
      console.log(response.data);
      setMessages(response.data);
    };
    fetchMessages();
  }, [auth.userId, auth.authToken]);
  useEffect(() => {
    const fetchDiscussions = async () => {
      const response = await axios.get(`/discussions?staff_id=${auth.userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth?.authToken}`,
        },
      });
      setDiscussions(response.data);
    };
    fetchDiscussions();
  }, [auth?.authToken, auth.userId]);
  return (
    discussions &&
    messages && (
      <div className="messages-section-box">
        {discussions.map((discussion) => (
          <Discussion
            discussion={discussion}
            key={discussion.id}
            messages={messages
              .filter(({ discussion_id }) => discussion_id === discussion.id)
              .sort(
                (a, b) => new Date(a.date_created) - new Date(b.date_created)
              )}
          />
        ))}
      </div>
    )
  );
};

export default MessagesBox;
