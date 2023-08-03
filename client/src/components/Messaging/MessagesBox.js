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
  const { auth, user, setUser } = useAuth();
  const [discussions, setDiscussions] = useState(null);

  useEffect(() => {
    const fetchDiscussions = async () => {
      const response = await axios.get(`/discussions?staff_id=${user.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      });
      //En fonction de la section on filtre les discussions
      const newDiscussions = filterAndSortDiscussions(
        section,
        response.data,
        user.id
      );
      setDiscussions(newDiscussions);
    };
    fetchDiscussions();
    return () => setDiscussions(null);
    //eslint-disable-next-line
  }, [auth.authToken, user.id, section]);

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
