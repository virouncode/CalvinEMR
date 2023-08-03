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
  transferVisible,
  setTransferVisible,
}) => {
  const { setAuth, auth } = useAuth();
  const [discussions, setDiscussions] = useState(null);

  useEffect(() => {
    const fetchDiscussions = async () => {
      const response = await axios.get(`/discussions?staff_id=${auth.userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth?.authToken}`,
        },
      });
      //En fonction de la section on filtre les discussions
      const newDiscussions = filterAndSortDiscussions(
        section,
        response.data,
        auth.userId
      );
      setDiscussions(newDiscussions);

      //unread messages
      let unreadMsgNbr = 0;
      for (let discussion of response.data) {
        const discussionMessages = (
          await axios.post(
            `/messages_selected`,
            { messages_ids: discussion.messages_ids },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth?.authToken}`,
              },
            }
          )
        ).data;
        if (
          discussionMessages.find(
            (message) =>
              !message.read_by_ids.includes(auth.userId) &&
              (message.to_ids.includes(auth.userId) ||
                message.transferred_to_ids.includes(auth.userId))
          )
        ) {
          unreadMsgNbr++;
        }
      }
      setAuth({ ...auth, unreadMessagesNbr: unreadMsgNbr });
    };
    fetchDiscussions();
    return () => setDiscussions(null);
    //eslint-disable-next-line
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
        {discussions ? (
          discussions?.length !== 0 ? (
            currentDiscussionId === 0 ? (
              <DiscussionsOverview
                discussions={discussions}
                setCurrentDiscussionId={setCurrentDiscussionId}
                staffInfos={staffInfos}
                setDiscussionsSelectedIds={setDiscussionsSelectedIds}
                discussionsSelectedIds={discussionsSelectedIds}
                section={section}
                setDiscussions={setDiscussions}
              />
            ) : (
              <DiscussionDetail
                setCurrentDiscussionId={setCurrentDiscussionId}
                discussion={discussions.find(
                  ({ id }) => id === currentDiscussionId
                )}
                staffInfos={staffInfos}
                setDiscussions={setDiscussions}
                setSection={setSection}
                section={section}
                transferVisible={transferVisible}
                setTransferVisible={setTransferVisible}
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
            section={section}
          />
        </NewWindow>
      )}
    </>
  );
};

export default MessagesBox;
