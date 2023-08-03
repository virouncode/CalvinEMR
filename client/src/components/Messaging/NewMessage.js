import React, { useState } from "react";
import Contacts from "./Contacts";
import { categoryToTitle } from "../../utils/categoryToTitle";
import formatName from "../../utils/formatName";
import Patients from "./Patients";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/xano";
import { toast } from "react-toastify";
import { filterAndSortDiscussions } from "../../utils/filterAndSortDiscussions";

const NewMessage = ({
  staffInfos,
  setNewVisible,
  setMessages,
  setDiscussions,
  section,
}) => {
  const { auth } = useAuth();
  const [recipientsIds, setRecipientsIds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [patientId, setPatientId] = useState(0);
  const [patientName, setPatientName] = useState("");
  const handleChange = (e) => {
    setBody(e.target.value);
  };

  const handleChangeSubject = (e) => {
    setSubject(e.target.value);
  };

  const isContactChecked = (id) => recipientsIds.includes(id);
  const isCategoryChecked = (category) => categories.includes(category);
  const isPatientChecked = (id) => patientId === id;

  const handleCheckPatient = (e) => {
    const id = parseInt(e.target.id);
    const checked = e.target.checked;
    const name = e.target.name;
    if (checked) {
      setPatientId(id);
      setPatientName(name);
    } else {
      setPatientId(0);
      setPatientName("");
    }
  };

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
    setNewVisible(false);
  };

  const handleSend = async (e) => {
    //create the message
    const message = {
      from_id: auth.userId,
      to_ids: recipientsIds,
      read_by_ids: [auth.userId],
      body: body,
      date_created: Date.parse(new Date()),
    };

    //post the message and get the id
    const response = await axios.post("/messages", message, {
      headers: {
        Authorization: `Bearer ${auth?.authToken}`,
        "Content-Type": "application/json",
      },
    });

    const messageId = response.data.id;

    //create a discussion
    const discussion = {
      author_id: auth.userId,
      subject: subject,
      participants_ids: recipientsIds.includes(auth.userId)
        ? recipientsIds
        : [...recipientsIds, auth.userId],
      related_patient_id: patientId,
      deleted_by_ids: [],
      messages_ids: [messageId],
      date_created: Date.parse(new Date()),
      date_updated: Date.parse(new Date()),
      replied: false,
    };

    try {
      await axios.post("/discussions", discussion, {
        headers: {
          Authorization: `Bearer ${auth?.authToken}`,
          "Content-Type": "application/json",
        },
      });

      const response2 = await axios.get(
        `/discussions?staff_id=${auth.userId}`,
        {
          headers: {
            Authorization: `Bearer ${auth?.authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const newDiscussions = filterAndSortDiscussions(
        section,
        response2.data,
        auth.userId
      );
      setDiscussions(newDiscussions);
      setNewVisible(false);
      toast.success("Message sent successfully", { containerId: "A" });
    } catch (err) {
      toast.error("Error: message wasn't sent");
    }
  };

  return (
    <div className="new-message">
      <div className="new-message-contacts">
        <Contacts
          staffInfos={staffInfos}
          handleCheckContact={handleCheckContact}
          isContactChecked={isContactChecked}
          handleCheckCategory={handleCheckCategory}
          isCategoryChecked={isCategoryChecked}
        />
      </div>
      <div className="new-message-form">
        <div className="new-message-form-recipients">
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
        <div className="new-message-form-object">
          Subject:{" "}
          <input
            type="text"
            placeholder="Subject"
            onChange={handleChangeSubject}
            value={subject}
          />
        </div>
        <div className="new-message-form-patient">
          About patient:{" "}
          <input
            type="text"
            placeholder="Patient"
            value={patientName}
            readOnly
          />
        </div>
        <div className="new-message-form-body">
          <textarea value={body} onChange={handleChange}></textarea>
        </div>
        <div className="new-message-form-btns">
          <button onClick={handleSend}>Send</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </div>
      <div className="new-message-patients">
        <Patients
          handleCheckPatient={handleCheckPatient}
          isPatientChecked={isPatientChecked}
        />
      </div>
    </div>
  );
};

export default NewMessage;
