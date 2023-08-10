import React, { useState } from "react";
import Contacts from "./Contacts";
import { categoryToTitle } from "../../utils/categoryToTitle";
import formatName from "../../utils/formatName";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/xano";
import { toast } from "react-toastify";
import Message from "./Message";
import { staffIdToName } from "../../utils/staffIdToName";
import { staffIdToTitle } from "../../utils/staffIdToTitle";
import { filterAndSortMessages } from "../../utils/filterAndSortMessages";

const ForwardForm = ({
  setForwardVisible,
  setMessages,
  section,
  message,
  previousMsgs,
  patient,
}) => {
  const { auth, user, clinic } = useAuth();
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
    const categoryContactsIds = clinic.staffInfos
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
    const categoryContactsIds = clinic.staffInfos
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
    setForwardVisible(false);
  };

  const handleSend = async (e) => {
    try {
      //create the message
      const forwardMessage = {
        from_id: user.id,
        to_ids: recipientsIds,
        read_by_ids: [user.id],
        subject: previousMsgs.length
          ? `Fwd ${previousMsgs.length + 1}: ${message.subject.slice(
              message.subject.indexOf(":") + 1
            )}`
          : `Fwd: ${message.subject}`,
        body: body,
        previous_ids: [...message.previous_ids, message.id],
        related_patient_id: message.related_patient_id || 0,
        date_created: Date.parse(new Date()),
      };

      //post the message
      await axios.post("/messages", forwardMessage, {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
          "Content-Type": "application/json",
        },
      });

      const response = await axios.get(`/messages?staff_id=${user.id}`, {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
          "Content-Type": "application/json",
        },
      });

      const newMessages = filterAndSortMessages(
        section,
        response.data,
        user.id
      );
      setMessages(newMessages);
      setForwardVisible(false);
      toast.success("Transfered successfully", { containerId: "A" });
    } catch (err) {
      toast.error("Error: message wasn't sent");
    }
  };

  return (
    <div className="forward">
      <div className="forward-contacts">
        <Contacts
          staffInfos={clinic.staffInfos}
          handleCheckContact={handleCheckContact}
          isContactChecked={isContactChecked}
          handleCheckCategory={handleCheckCategory}
          isCategoryChecked={isCategoryChecked}
        />
      </div>
      <div className="forward-form">
        <div className="forward-form-recipients">
          To:{" "}
          <input
            type="text"
            placeholder="Recipients"
            value={clinic.staffInfos
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
        <div className="forward-form-object">
          Subject:{" "}
          {previousMsgs.length
            ? `Fwd ${previousMsgs.length + 1}: ${message.subject.slice(
                message.subject.indexOf(":") + 1
              )}`
            : `Fwd: ${message.subject}`}
        </div>
        {patient?.full_name && (
          <div className="forward-form-patient">
            About patient: {patient.full_name}
          </div>
        )}
        <div className="forward-form-body">
          <textarea value={body} onChange={handleChange}></textarea>
          <div className="forward-form-history">
            <Message
              message={message}
              author={staffIdToName(clinic.staffInfos, message.from_id)}
              authorTitle={staffIdToTitle(clinic.staffInfos, message.from_id)}
              key={message.id}
              index={0}
            />
            {previousMsgs.map((message, index) => (
              <Message
                message={message}
                author={staffIdToName(clinic.staffInfos, message.from_id)}
                authorTitle={staffIdToTitle(clinic.staffInfos, message.from_id)}
                key={message.id}
                index={index + 1}
              />
            ))}
          </div>
        </div>
        <div className="forward-form-btns">
          <button onClick={handleSend}>Send</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ForwardForm;
