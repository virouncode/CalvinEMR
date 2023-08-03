import React, { useState } from "react";
import Contacts from "./Contacts";
import { categoryToTitle } from "../../utils/categoryToTitle";
import formatName from "../../utils/formatName";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/xano";
import { toast } from "react-toastify";
import { filterAndSortDiscussions } from "../../utils/filterAndSortDiscussions";
import Message from "./Message";
import { staffIdToName } from "../../utils/staffIdToName";
import { staffIdToTitle } from "../../utils/staffIdToTitle";

const TransferForm = ({
  staffInfos,
  setTransferVisible,
  setMessages,
  setDiscussions,
  section,
  discussion,
  patient,
  discussionMsgs,
}) => {
  const { auth, user } = useAuth();
  const [recipientsIds, setRecipientsIds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [body, setBody] = useState("");

  const handleChange = (e) => {
    setBody(e.target.value);
  };

  const isContactChecked = (id) => recipientsIds.includes(id);
  const isCategoryChecked = (category) => categories.includes(category);

  const handleCheckContact = (e) => {
    const id = parseInt(e.target.id);
    const checked = e.target.checked;
    const category = e.target.name;
    const categoryContactsIds = staffInfos
      .filter(({ title }) => title === categoryToTitle(category))
      .map(({ id }) => id);

    if (checked) {
      let recipientsIdsUpdated = [...recipientsIds, id];
      setRecipientsIds(recipientsIdsUpdated);
      if (
        categoryContactsIds.every((id) => recipientsIdsUpdated.includes(id))
      ) {
        setCategories([...categories, category]);
      }
    } else {
      let recipientsIdsUpdated = [...recipientsIds];
      recipientsIdsUpdated = recipientsIdsUpdated.filter(
        (recipientId) => recipientId !== id
      );
      setRecipientsIds(recipientsIdsUpdated);
      if (categories.includes(category)) {
        let categoriesUpdated = [...categories];
        categoriesUpdated = categoriesUpdated.filter(
          (categoryName) => categoryName !== category
        );
        setCategories(categoriesUpdated);
      }
    }
  };

  const handleCheckCategory = (e) => {
    const category = e.target.id;
    const checked = e.target.checked;
    const categoryContactsIds = staffInfos
      .filter(({ title }) => title === categoryToTitle(category))
      .map(({ id }) => id);

    if (checked) {
      setCategories([...categories, category]);
      //All contacts of category

      let recipientsIdsUpdated = [...recipientsIds];
      categoryContactsIds.forEach((id) => {
        if (!recipientsIdsUpdated.includes(id)) {
          recipientsIdsUpdated.push(id);
        }
      });
      setRecipientsIds(recipientsIdsUpdated);
    } else {
      let categoriesUpdated = [...categories];
      categoriesUpdated = categoriesUpdated.filter((name) => name !== category);
      setCategories(categoriesUpdated);

      let recipientsIdsUpdated = [...recipientsIds];
      recipientsIdsUpdated = recipientsIdsUpdated.filter(
        (id) => !categoryContactsIds.includes(id)
      );
      setRecipientsIds(recipientsIdsUpdated);
    }
  };

  const handleCancel = (e) => {
    setTransferVisible(false);
  };

  const handleSend = async (e) => {
    //add recipient ids to transferred_to_ids of all messages
    for (let message of discussionMsgs) {
      const transferredToIds = message.transferred_to_ids;
      const arr = [...transferredToIds, ...recipientsIds];
      const newTranferredToIds = [...new Set(arr)];
      const newMessage = { ...message, transferred_to_ids: newTranferredToIds };
      await axios.put(`/messages/${message.id}`, newMessage, {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
          "Content-Type": "application/json",
        },
      });
    }
    try {
      //create the message
      const message = {
        from_id: user.id,
        to_ids: recipientsIds,
        date_created: Date.parse(new Date()),
        read_by_ids: [user.id],
        body: body,
        transferred_to_ids: [],
      };

      //post the message
      const response = await axios.post("/messages", message, {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
          "Content-Type": "application/json",
        },
      });

      const messageId = response.data.id;

      //change discussion, add recipientsIds to participantsIds
      const particpantsIds = discussion.participants_ids;
      const arr = [...particpantsIds, ...recipientsIds];
      const newParticipantsIds = [...new Set(arr)];
      const newDiscussion = {
        ...discussion,
        participants_ids: newParticipantsIds,
        date_updated: Date.parse(new Date()),
        messages_ids: [...discussion.messages_ids, messageId],
      };

      //put the discussion
      await axios.put(`/discussions/${discussion.id}`, newDiscussion, {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
          "Content-Type": "application/json",
        },
      });

      //update discussions
      const response2 = await axios.get(`/discussions?staff_id=${user.id}`, {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
          "Content-Type": "application/json",
        },
      });

      //update the discussions for the UI
      const newDiscussions = filterAndSortDiscussions(
        section,
        response2.data,
        user.id
      );
      setDiscussions(newDiscussions);
      setTransferVisible(false);
      toast.success("Transfered successfully", { containerId: "A" });
    } catch (err) {
      toast.error("Error: message wasn't sent");
    }
  };

  return (
    <div className="transfer">
      <div className="transfer-contacts">
        <Contacts
          staffInfos={staffInfos}
          handleCheckContact={handleCheckContact}
          isContactChecked={isContactChecked}
          handleCheckCategory={handleCheckCategory}
          isCategoryChecked={isCategoryChecked}
        />
      </div>
      <div className="transfer-form">
        <div className="transfer-form-recipients">
          To:{" "}
          <input
            type="text"
            placeholder="Recipients"
            value={staffInfos
              .filter(({ id }) => recipientsIds.includes(id))
              .map(
                (staff) =>
                  (staff.title === "Doctor" ? "Dr. " : "") +
                  formatName(staff.full_name)
              )
              .join(", ")}
            readOnly
          />
        </div>
        <div className="transfer-form-object">
          Subject: {discussion.subject}
        </div>
        {patient?.full_name && (
          <div className="transfer-form-patient">
            About patient: {patient.full_name}
          </div>
        )}
        <div className="transfer-form-body">
          <textarea value={body} onChange={handleChange}></textarea>
          <div className="transfer-form-history">
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
        </div>
        <div className="transfer-form-btns">
          <button onClick={handleSend}>Send</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default TransferForm;
