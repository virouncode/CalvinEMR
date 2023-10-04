import React, { useEffect, useState } from "react";
import axiosXano from "../../../api/xano";
import useAuth from "../../../hooks/useAuth";
import { toLocalDateAndTimeWithSeconds } from "../../../utils/formatDates";
import { staffIdToTitleAndName } from "../../../utils/staffIdToTitleAndName";
import ProgressNotesAttachments from "./ProgressNotesAttachments";

const ProgressNotesCardPrint = ({ progressNote }) => {
  const { auth, clinic } = useAuth();
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      const response = (
        await axiosXano.post(
          "/attachments_for_progress_note",
          { attachments_ids: progressNote.attachments_ids },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
          }
        )
      ).data;
      setAttachments(response);
    };
    fetchFiles();
  }, [auth.authToken, progressNote.attachments_ids]);
  //styles
  const BODY_STYLE = {
    padding: "20px",
    textAlign: "justify",
  };
  const FOOTER_STYLE = {
    textAlign: "end",
    fontSize: "0.6rem",
    fontStyle: "italic",
  };

  const getAuthorTitle = () => {
    if (
      progressNote.updated_by_title?.title &&
      progressNote.updated_by_title?.title === "Doctor"
    ) {
      return "Dr. ";
    } else if (progressNote.created_by_title?.title === "Doctor") {
      return "Dr. ";
    } else {
      return "";
    }
  };

  return (
    <div className="progress-notes-card-print">
      <div className="progress-notes-card-print-header">
        <div className="progress-notes-card-print-header-title">
          <p style={{ margin: "0", padding: "0" }}>
            <strong>From: </strong>
            {getAuthorTitle()}{" "}
            {staffIdToTitleAndName(
              clinic.staffInfos,
              progressNote.updated_by_id,
              true
            ) ||
              staffIdToTitleAndName(
                clinic.staffInfos,
                progressNote.created_by_id,
                true
              )}
          </p>
          <p style={{ margin: "0", fontSize: "0.7rem", padding: "0 5px" }}>
            Signed on{" "}
            {progressNote.date_updated
              ? toLocalDateAndTimeWithSeconds(progressNote.date_updated)
              : toLocalDateAndTimeWithSeconds(progressNote.date_created)}
          </p>
        </div>
        <div>
          <label>
            <strong>Subject: </strong>
          </label>
          {progressNote.object}
        </div>
        <div>
          <div>
            <label>
              <strong>Version: </strong>
            </label>
            {"V" + progressNote.version_nbr.toString()}
          </div>
        </div>
      </div>
      <div style={BODY_STYLE}>
        <p>{progressNote.body}</p>
        <div style={FOOTER_STYLE}>
          {progressNote.updated_by_id ? (
            <p style={{ margin: "0" }}>
              Updated by{" "}
              {staffIdToTitleAndName(
                clinic.staffInfos,
                progressNote.updated_by_id,
                true
              )}{" "}
              on {toLocalDateAndTimeWithSeconds(progressNote.date_updated)}
            </p>
          ) : null}
          <p style={{ margin: "0" }}>
            Created by{" "}
            {staffIdToTitleAndName(
              clinic.staffInfos,
              progressNote.created_by_id,
              true
            )}{" "}
            on {toLocalDateAndTimeWithSeconds(progressNote.date_created)}
          </p>
        </div>
      </div>
      <ProgressNotesAttachments attachments={attachments} deletable={false} />
    </div>
  );
};

export default ProgressNotesCardPrint;
