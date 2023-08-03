import React, { useEffect, useState } from "react";
import Message from "./Message";
import ReplyForm from "./ReplyForm";
import axios from "../../api/xano";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { filterAndSortDiscussions } from "../../utils/filterAndSortDiscussions";
import NewWindow from "react-new-window";
import TransferForm from "./TransferForm";
import { staffIdToTitle } from "../../utils/staffIdToTitle";
import { staffIdToName } from "../../utils/staffIdToName";

const DiscussionDetail = ({
  setCurrentDiscussionId,
  discussion,
  staffInfos,
  setDiscussions,
  setSection,
  section,
}) => {
  const [replyVisible, setReplyVisible] = useState(false);
  const [transferVisible, setTransferVisible] = useState(false);
  const [allPersons, setAllPersons] = useState(false);
  const { auth, user } = useAuth();
  const [patient, setPatient] = useState({});
  const [discussionMsgs, setDiscussionMsgs] = useState([]);

  useEffect(() => {
    const fetchDiscussionMsgs = async () => {
      const allDiscussionMsgs = (
        await axios.post(
          "/messages_selected",
          { messages_ids: discussion.messages_ids },
          {
            headers: {
              Authorization: `Bearer ${auth.authToken}`,
              "Content-Type": "application/json",
            },
          }
        )
      ).data;
      setDiscussionMsgs(
        allDiscussionMsgs
          .filter(
            (message) =>
              message.to_ids.includes(user.id) ||
              message.from_id === user.id ||
              message.transferred_to_ids.includes(user.id)
          )
          .sort((a, b) => a.date_created - b.date_created)
      );
    };
    fetchDiscussionMsgs();
  }, [auth.authToken, user.id, discussion.messages_ids]);

  useEffect(() => {
    const fetchPatient = async () => {
      const response = await axios.get(
        `patients/${discussion.related_patient_id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setPatient(response.data);
    };
    discussion.related_patient_id && fetchPatient();
  }, [auth.authToken, discussion.related_patient_id]);

  const handleClickBack = (e) => {
    setCurrentDiscussionId(0);
  };

  const handleDeleteDiscussion = async (e) => {
    try {
      await axios.put(
        `/discussions/${discussion.id}`,
        {
          ...discussion,
          deleted_by_ids: [...discussion.deleted_by_ids, user.id],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      );
      const response2 = await axios.get(`/discussions?staff_id=${user.id}`, {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
          "Content-Type": "application/json",
        },
      });
      const newDiscussions = filterAndSortDiscussions(
        section,
        response2.data,
        user.id
      );
      setDiscussions(newDiscussions);
      setCurrentDiscussionId(0);
      toast.success("Discussion deleted successfully", { containerId: "A" });
    } catch (err) {
      console.log(err);
      toast.error("Couldn't delete discussion", { containerId: "A" });
    }
  };

  const handleClickReply = (e) => {
    setReplyVisible(true);
    setAllPersons(false);
  };
  const handleClickReplyAll = (e) => {
    setReplyVisible(true);
    setAllPersons(true);
  };

  const handleClickTransfer = (e) => {
    setTransferVisible(true);
  };

  return (
    <>
      <div className="discussion-detail-toolbar">
        <i
          className="fa-solid fa-arrow-left discussion-detail-toolbar-arrow"
          style={{ cursor: "pointer" }}
          onClick={handleClickBack}
        ></i>
        <div className="discussion-detail-toolbar-subject">
          {discussion.subject}
        </div>
        {section !== "Deleted messages" && (
          <i
            className="fa-solid fa-trash  discussion-detail-toolbar-trash"
            style={{ cursor: "pointer" }}
            onClick={handleDeleteDiscussion}
          ></i>
        )}
      </div>
      <div className="discussion-detail-content">
        {discussionMsgs.map((message) => (
          <Message
            message={message}
            author={staffIdToName(staffInfos, message.from_id)}
            authorTitle={staffIdToTitle(staffInfos, message.from_id)}
            discussion={discussion}
            staffInfos={staffInfos}
            key={message.id}
          />
        ))}
      </div>
      {replyVisible && (
        <ReplyForm
          setReplyVisible={setReplyVisible}
          allPersons={allPersons}
          discussion={discussion}
          discussionMsgs={discussionMsgs}
          staffInfos={staffInfos}
          setDiscussions={setDiscussions}
          section={section}
        />
      )}
      {section !== "Deleted messages" && (
        <div className="discussion-detail-btns">
          <button onClick={handleClickReply} disabled={replyVisible}>
            Reply
          </button>
          {discussion.participants_ids.length >= 3 && (
            <button onClick={handleClickReplyAll} disabled={replyVisible}>
              Reply all
            </button>
          )}
          <button onClick={handleClickTransfer} disabled={transferVisible}>
            Transfer
          </button>
        </div>
      )}
      {transferVisible && (
        <NewWindow
          title="Transfer Discussion"
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
          onUnload={() => setTransferVisible(false)}
        >
          <TransferForm
            staffInfos={staffInfos}
            setTransferVisible={setTransferVisible}
            setDiscussions={setDiscussions}
            section={section}
            discussion={discussion}
            patient={patient}
            discussionMsgs={discussionMsgs}
          />
        </NewWindow>
      )}
    </>
  );
};

export default DiscussionDetail;
