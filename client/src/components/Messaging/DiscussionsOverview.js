import React from "react";
import DiscussionThumbnail from "./DiscussionThumbnail";

const DiscussionsOverview = ({
  discussions,
  setDiscussions,
  setCurrentDiscussionId,
  staffInfos,
  setDiscussionsSelectedIds,
  discussionsSelectedIds,
  section,
}) => {
  return discussions.map((discussion) => (
    <DiscussionThumbnail
      key={discussion.id}
      discussion={discussion}
      setDiscussions={setDiscussions}
      setCurrentDiscussionId={setCurrentDiscussionId}
      staffInfos={staffInfos}
      setDiscussionsSelectedIds={setDiscussionsSelectedIds}
      discussionsSelectedIds={discussionsSelectedIds}
      section={section}
    />
  ));
};

export default DiscussionsOverview;
