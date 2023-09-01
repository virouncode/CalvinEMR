import React from "react";
import MessageAttachmentCard from "./MessageAttachmentCard";

const MessagesAttachments = ({
  attachments,
  deletable,
  cardWidth,
  handleRemoveAttachment = null,
}) => {
  return (
    attachments && (
      <div className="messages-attachments">
        {attachments.map((attachment) => (
          <MessageAttachmentCard
            handleRemoveAttachment={handleRemoveAttachment}
            attachment={attachment}
            key={attachment.id}
            deletable={deletable}
            cardWidth={cardWidth}
          />
        ))}
      </div>
    )
  );
};

export default MessagesAttachments;
