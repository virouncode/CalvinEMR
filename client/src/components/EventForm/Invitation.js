//LIBRARY
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

//COMPONENTS
import TemplatesRadio from "./TemplatesRadio";
import AddressesList from "../Lists/AddressesList";

//UTILS
import useAuth from "../../hooks/useAuth";
import { sendEmail } from "../../api/sendEmail";
import formatName from "../../utils/formatName";
import axios from "../../api/xano";

const Invitation = ({
  setInvitationVisible,
  hostId,
  staffInfos,
  start,
  end,
  patientsGuestsInfos,
  staffGuestsInfos,
  settings,
}) => {
  //HOOKS
  const { auth } = useAuth();
  const [message, setMessage] = useState(
    settings.invitation_templates.find(
      ({ name }) => name === "In person appointment"
    ).message
  );
  const [intro, setIntro] = useState(
    settings.invitation_templates.find(
      ({ name }) => name === "In person appointment"
    ).intro
  );
  const [templateSelected, setTemplateSelected] = useState(
    "In person appointment"
  );
  const [addressSelected, setAddressSelected] = useState(
    settings.clinic_address
  );
  const [sites, setSites] = useState([]);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const response = await axios.get(`/sites`, {
          headers: {
            Authorization: `Bearer ${auth.authToken}`,
          },
        });
        setSites(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSites();
  }, [auth.authToken]);

  //HANDLERS
  const handleSend = async (e) => {
    e.preventDefault();
    if (
      templateSelected !== "Video appointment" &&
      templateSelected !== "Phone appointment" &&
      templateSelected !== "[Blank]" &&
      !addressSelected
    ) {
      alert("Please choose a clinic address first");
      return;
    }
    const host_title =
      staffInfos.find(({ id }) => id === hostId).title === "Doctor"
        ? "Dr."
        : "";
    const host_name =
      host_title +
      " " +
      formatName(staffInfos.find(({ id }) => id === hostId).full_name);

    let optionsDate = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };

    let optionsTime = {
      hour: "2-digit",
      minute: "2-digit",
    };

    const subject = `Appointment ${new Date(start).toLocaleString(
      "en-CA",
      optionsDate
    )} - ${new Date(start).toLocaleTimeString("en-CA", optionsTime)}`;

    const clinic = sites.find(({ name }) => name === addressSelected);
    const clinicName = clinic?.name;
    const adressToSend = clinic?.address;
    const postalCodeToSend = clinic?.postal_code;
    const cityToSend = clinic?.city;
    const countryToSend = clinic?.country;

    const infosToSend = settings.invitation_templates
      .find(({ name }) => name === templateSelected)
      .infos.replace("[host_name]", host_name)
      .replace(
        "[date]",
        `${new Date(start).toLocaleString("en-CA", optionsDate)} ${new Date(
          start
        ).toLocaleTimeString("en-CA", optionsTime)} - ${new Date(
          end
        ).toLocaleTimeString("en-CA", optionsTime)}`
      )
      .replace(
        "[address_of_clinic]",
        `${clinicName} ${adressToSend} ${postalCodeToSend} ${cityToSend} ${countryToSend}`
      )
      .replace(
        "[video_call_link]",
        staffInfos.find(({ id }) => id === auth.userId).video_link
      );

    for (const patientInfos of patientsGuestsInfos) {
      try {
        await sendEmail(
          "virirak@gmail.com",
          patientInfos.full_name,
          subject,
          intro,
          infosToSend,
          message,
          `Best wishes, \nPowered by Calvin EMR`
        );
        toast.success(
          `Invitation sent successfully to ${patientInfos.full_name}`,
          { containerId: "A" }
        );
      } catch (err) {
        toast.error(`Couldn't send the invitation : $(err.text)`, {
          containerId: "A",
        });
      }
      fetch("/api/twilio/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "+16474447761", //to be changed to patientInfos.cell_phone
          body: `
Hello ${patientInfos.full_name},
          
${intro}
          
${infosToSend}
          
${message}
          
Best wishes,
Powered by Calvin EMR`,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            console.log(data);
          } else {
            console.log("error");
            toast.error(`Couldn't send the sms invitation : $(err.text)`, {
              containerId: "A",
            });
          }
        });
    }
    for (const staffInfos of staffGuestsInfos) {
      try {
        await sendEmail(
          "virirak@gmail.com",
          staffInfos.full_name,
          subject,
          intro,
          infosToSend,
          message,
          `Best wishes, \nPowered by Calvin EMR`
        );
        toast.success(
          `Invitation email successfully sent to ${staffInfos.full_name}`,
          { containerId: "A" }
        );
      } catch (err) {
        toast.error(`Couldn't send the invitation email : $(err.text)`, {
          containerId: "A",
        });
      }
      fetch("/api/twilio/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "+16474447761", //to be changed to staffInfos.cell_phone
          body: `
Hello ${staffInfos.full_name},
          
${intro}
          
${infosToSend}
          
${message}
          
Best wishes,
Powered by Calvin EMR`,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            console.log(data);
          } else {
            console.log("error");
            toast.error(`Couldn't send the sms invitation : $(err.text)`, {
              containerId: "A",
            });
          }
        });
    }
  };
  const handleSendAndSave = async (e) => {
    e.preventDefault();
    handleSend(e);
    const newTemplates = [...settings.invitation_templates];
    newTemplates.find(({ name }) => name === templateSelected).intro = intro;
    newTemplates.find(({ name }) => name === templateSelected).message =
      message;
    try {
      await axios.put(
        `/settings/${settings.id}`,
        { ...settings, invitation_templates: newTemplates },
        {
          headers: {
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };
  const handleIntroChange = (e) => {
    setIntro(e.target.value);
  };
  const handleCancel = (e) => {
    e.preventDefault();
    setInvitationVisible(false);
  };
  const handleTemplateChange = (e) => {
    setTemplateSelected(e.target.name);
    setIntro(
      settings.invitation_templates.find(({ name }) => name === e.target.name)
        .intro
    );
    setMessage(
      settings.invitation_templates.find(({ name }) => name === e.target.name)
        .message
    );
  };
  const handleAddressChange = async (e) => {
    setAddressSelected(e.target.value);
    try {
      await axios.put(
        `/settings/${settings.id}`,
        { ...settings, clinic_address: e.target.value },
        {
          headers: {
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="invitation">
      <div className="invitation-edit">
        <div className="invitation-edit-row">
          <label>Introduction:</label>
          <textarea
            onChange={handleIntroChange}
            value={intro}
            style={{ height: "60px" }}
          />
        </div>
        <div className="invitation-edit-row">
          {templateSelected === "Video appointment" ? (
            <label>
              Appointment Infos (read only,{" "}
              <span style={{ color: "red" }}>
                please be sure you provided a video call link, see "My Account"
                section
              </span>
              ):
            </label>
          ) : (
            <label>
              Appointment Infos (read only):
              {templateSelected !== "Video appointment" &&
                templateSelected !== "Phone appointment" &&
                templateSelected !== "[Blank]" && (
                  <AddressesList
                    handleAddressChange={handleAddressChange}
                    addressSelected={addressSelected}
                    sites={sites}
                  />
                )}
            </label>
          )}
          <textarea
            value={
              settings.invitation_templates.find(
                ({ name }) => name === templateSelected
              ).infos
            }
            readOnly
            style={{ height: "130px" }}
          />
        </div>
        <div className="invitation-edit-row">
          <label>Message:</label>
          <textarea
            onChange={handleMessageChange}
            value={message}
            style={{ height: "170px" }}
          />
        </div>
      </div>
      <TemplatesRadio
        handleTemplateChange={handleTemplateChange}
        templates={settings.invitation_templates}
        templateSelected={templateSelected}
      />
      <div className="invitation-btn-row">
        {auth.userId === hostId && (
          <button onClick={handleSendAndSave}>Send & Save Template</button>
        )}
        <button onClick={handleSend}>Send</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default Invitation;
