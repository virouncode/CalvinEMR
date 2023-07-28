import React from "react";
import AttachmentCard from "./AttachmentCard";

const ProgressNotesAttachments = ({
  files,
  deletable,
  handleRemoveAttachment = null,
}) => {
  return (
    files && (
      <div className="progress-notes-attachments">
        {files.map((file) => (
          <AttachmentCard
            handleRemoveAttachment={handleRemoveAttachment}
            file={file}
            key={file.name}
            deletable={deletable}
          />
        ))}
      </div>
    )
  );
};

export default ProgressNotesAttachments;
