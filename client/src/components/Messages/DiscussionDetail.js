import React, { useState } from "react";
import Message from "./Message";
import ReplyForm from "./ReplyForm";

const DiscussionDetail = ({
  setCurrentDiscussionId,
  discussion,
  messages,
  setMessages,
  staffInfos,
  setDiscussions,
}) => {
  const [replyVisible, setReplyVisible] = useState(false);
  const [transferVisible, setTransferVisible] = useState(false);
  const [allPersons, setAllPersons] = useState(false);

  const handleClickBack = (e) => {
    setCurrentDiscussionId(0);
  };

  const handleDeleteDiscussion = (e) => {};

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
        <i
          className="fa-solid fa-trash  discussion-detail-toolbar-trash"
          style={{ cursor: "pointer" }}
          onClick={handleDeleteDiscussion}
        ></i>
      </div>
      <div className="discussion-detail-content">
        {messages
          .filter(({ discussion_id }) => discussion_id === discussion.id)
          .map((message) => (
            <Message
              message={message}
              author={
                staffInfos.find(({ id }) => id === message.from_id).full_name
              }
              authorTitle={
                staffInfos.find(({ id }) => id === message.from_id).title ===
                "Doctor"
                  ? "Dr. "
                  : ""
              }
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
          staffInfos={staffInfos}
          messages={messages}
          setMessages={setMessages}
          setDiscussions={setDiscussions}
        />
      )}
      <div className="discussion-detail-btns">
        <button onClick={handleClickReply} disabled={replyVisible}>
          Reply
        </button>
        {discussion.staff_ids.length >= 3 && (
          <button onClick={handleClickReplyAll} disabled={replyVisible}>
            Reply all
          </button>
        )}
        <button onClick={handleClickTransfer} disabled={replyVisible}>
          Transfer
        </button>
      </div>
    </>
  );
};

export default DiscussionDetail;
