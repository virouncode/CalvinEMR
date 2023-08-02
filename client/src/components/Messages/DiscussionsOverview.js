import React from "react";
import DiscussionThumbnail from "./DiscussionThumbnail";

const DiscussionsOverview = ({
  discussions,
  messages,
  setCurrentDiscussionId,
  staffInfos,
  setMessages,
  setDiscussionsSelectedIds,
  discussionsSelectedIds,
  section,
  setDiscussions,
}) => {
  return discussions.map((discussion) => (
    <DiscussionThumbnail
      discussion={discussion}
      key={discussion.id}
      messages={messages.filter(
        ({ discussion_id }) => discussion_id === discussion.id
      )}
      setMessages={setMessages}
      setCurrentDiscussionId={setCurrentDiscussionId}
      staffInfos={staffInfos}
      setDiscussionsSelectedIds={setDiscussionsSelectedIds}
      discussionsSelectedIds={discussionsSelectedIds}
      section={section}
      setDiscussions={setDiscussions}
    />
  ));
};

export default DiscussionsOverview;
