import React, { useEffect, useState } from "react";
import axios from "../../api/xano";
import useAuth from "../../hooks/useAuth";
import DiscussionDetail from "./DiscussionDetail";
import DiscussionsOverview from "./DiscussionsOverview";
import NewMessage from "./NewMessage";
import NewWindow from "react-new-window";
import { CircularProgress } from "@mui/material";

const MessagesBox = ({
  category,
  search,
  newVisible,
  setNewVisible,
  staffInfos,
}) => {
  const { auth } = useAuth();
  const [discussions, setDiscussions] = useState(null);
  const [messages, setMessages] = useState(null);
  const [currentDiscussionId, setCurrentDiscussionId] = useState(0);
  console.log("render messagebox");
  useEffect(() => {
    const fetchMessages = async () => {
      const response = await axios.get(`/messages?staff_id=${auth.userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth?.authToken}`,
        },
      });
      console.log("message from mssagesBox", response.data);
      setMessages(
        response.data.sort(
          (a, b) => new Date(a.date_created) - new Date(b.date_created)
        )
      );
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
      setDiscussions(
        response.data.sort(
          (a, b) => new Date(b.date_updated) - new Date(a.date_updated)
        )
      );
    };
    fetchDiscussions();
  }, [auth?.authToken, auth.userId]);

  return discussions && messages ? (
    <>
      <div className="messages-section-box">
        {messages.length !== 0 ? (
          currentDiscussionId === 0 ? (
            <DiscussionsOverview
              discussions={discussions}
              messages={messages}
              setCurrentDiscussionId={setCurrentDiscussionId}
              staffInfos={staffInfos}
              setMessages={setMessages}
            />
          ) : (
            <DiscussionDetail
              messages={messages}
              setMessages={setMessages}
              setCurrentDiscussionId={setCurrentDiscussionId}
              discussion={discussions.find(
                ({ id }) => id === currentDiscussionId
              )}
              staffInfos={staffInfos}
              setDiscussions={setDiscussions}
            />
          )
        ) : (
          <p>You don't have any messages</p>
        )}
      </div>
      {newVisible && (
        <NewWindow
          title="New Message"
          features={{
            toolbar: "no",
            scrollbars: "no",
            menubar: "no",
            status: "no",
            directories: "no",
            width: 1000,
            height: 500,
            left: 0,
            top: 0,
          }}
          onUnload={() => setNewVisible(false)}
        >
          <NewMessage
            staffInfos={staffInfos}
            setNewVisible={setNewVisible}
            setDiscussions={setDiscussions}
            setMessages={setMessages}
          />
        </NewWindow>
      )}
    </>
  ) : (
    <CircularProgress />
  );
};

export default MessagesBox;
