import React, { useEffect, useRef, useState } from "react";
import axios from "../../api/xano";
import useAuth from "../../hooks/useAuth";
import DiscussionDetail from "./DiscussionDetail";
import DiscussionsOverview from "./DiscussionsOverview";
import NewMessage from "./NewMessage";
import NewWindow from "react-new-window";
import { CircularProgress } from "@mui/material";
import { filterAndSortDiscussions } from "../../utils/filterAndSortDiscussions";

const MessagesBox = ({
  section,
  search,
  newVisible,
  setNewVisible,
  staffInfos,
  setSection,
  setDiscussionsSelectedIds,
  discussionsSelectedIds,
  currentDiscussionId,
  setCurrentDiscussionId,
}) => {
  const { setAuth, auth } = useAuth();
  const [discussions, setDiscussions] = useState(null);
  const [messages, setMessages] = useState(null);
  // const loading = useRef(false);

  console.log("render");

  //Voir en fonction de section
  useEffect(() => {
    const fetchMessages = async () => {
      console.log("fetchMessages");
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
      const unreadMessagesNbr = response.data.reduce(
        (accumulator, currentValue) => {
          if (!currentValue.read_by_ids.includes(auth.userId)) {
            return accumulator + 1;
          } else {
            return accumulator;
          }
        },
        0
      );
      setAuth({ ...auth, unreadMessagesNbr: unreadMessagesNbr });
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
      const newDiscussions = filterAndSortDiscussions(
        section,
        response.data,
        auth.userId
      );
      setDiscussions(newDiscussions);
    };
    fetchDiscussions();
    return () => setDiscussions(null);
  }, [auth?.authToken, auth.userId, section]);

  const emptySectionMessages = (sectionName) => {
    switch (sectionName) {
      case "Inbox":
        return "No inbox messages";
      case "Sent messages":
        return "No sent messages";
      case "Deleted messages":
        return "No deleted messages";
      default:
        break;
    }
  };

  return (
    <>
      <div className="messages-section-box">
        {discussions && messages ? (
          discussions?.length !== 0 ? (
            currentDiscussionId === 0 ? (
              <DiscussionsOverview
                discussions={discussions}
                messages={messages}
                setCurrentDiscussionId={setCurrentDiscussionId}
                staffInfos={staffInfos}
                setMessages={setMessages}
                setDiscussionsSelectedIds={setDiscussionsSelectedIds}
                discussionsSelectedIds={discussionsSelectedIds}
                section={section}
                setDiscussions={setDiscussions}
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
                setSection={setSection}
                section={section}
              />
            )
          ) : (
            <p>{emptySectionMessages(section)}</p>
          )
        ) : (
          <CircularProgress />
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
            section={section}
          />
        </NewWindow>
      )}
    </>
  );
};

export default MessagesBox;
