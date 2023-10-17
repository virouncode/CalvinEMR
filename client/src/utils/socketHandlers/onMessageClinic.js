export const onMessageClinic = (message, clinic, setClinic) => {
  if (message.route !== "PATIENTS" && message.route !== "STAFF") return;
  if (message.route === "PATIENTS") {
    switch (message.action) {
      case "create":
        setClinic({
          ...clinic,
          patientsInfos: [...clinic.patientsInfos, message.content.data],
        });
        localStorage.setItem(
          "clinic",
          JSON.stringify({
            ...clinic,
            patientsInfos: [...clinic.patientsInfos, message.content.data],
          })
        );
        break;
      case "update":
        setClinic({
          ...clinic,
          patientsInfos: clinic.patientsInfos.filter((patient) =>
            patient.id === message.content.id ? message.content.data : patient
          ),
        });
        localStorage.setItem(
          "clinic",
          JSON.stringify({
            ...clinic,
            patientsInfos: clinic.patientsInfos.filter((patient) =>
              patient.id === message.content.id ? message.content.data : patient
            ),
          })
        );
        break;
      default:
        break;
    }
  } else if (message.route === "STAFF") {
    switch (message.action) {
      case "create":
        setClinic({
          ...clinic,
          staffInfos: [...clinic.staffInfos, message.content.data],
        });
        localStorage.setItem(
          "clinic",
          JSON.stringify({
            ...clinic,
            staffInfos: [...clinic.staffInfos, message.content.data],
          })
        );
        break;
      case "update":
        setClinic({
          ...clinic,
          staffInfos: clinic.staffInfos.filter((staff) =>
            staff.id === message.content.id ? message.content.data : staff
          ),
        });
        localStorage.setItem(
          "clinic",
          JSON.stringify({
            ...clinic,
            staffInfos: clinic.staffInfos.filter((staff) =>
              staff.id === message.content.id ? message.content.data : staff
            ),
          })
        );
        break;
      default:
        break;
    }
  }
};
