import React from "react";
import AttachmentCard from "./AttachmentCard";

const ProgressNotesAttachments = ({
  patientId,
  attachments,
  deletable,
  handleRemoveAttachment = null,
}) => {
  return (
    attachments && (
      <div className="progress-notes-attachments">
        {attachments.map((attachment) => (
          <AttachmentCard
            handleRemoveAttachment={handleRemoveAttachment}
            attachment={attachment}
            key={attachment.id}
            deletable={deletable}
            patientId={patientId}
          />
        ))}
      </div>
    )
  );
};

export default ProgressNotesAttachments;
