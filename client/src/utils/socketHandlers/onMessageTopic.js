export const onMessageTopic = (message, topic, datas, setDatas, patientId) => {
  if (message.route !== topic) return;
  if (message.route === "APPOINTMENTS") {
    switch (message.action) {
      case "create":
        if (!message.content.data.patients_guests_ids.includes(patientId)) {
          break;
        }
        setDatas([...datas, message.content.data]);
        break;
      case "update":
        if (!message.content.data.patients_guests_ids.includes(patientId)) {
          break;
        }
        setDatas(
          datas.map((item) =>
            item.id === message.content.id ? message.content.data : item
          )
        );
        break;
      case "delete":
        setDatas(datas.filter((item) => item.id !== message.content.id));
        break;
      default:
        break;
    }
  } else if (
    message.route === "FAMILY DOCTORS/SPECIALISTS" ||
    message.route === "PHARMACIES"
  ) {
    switch (message.action) {
      case "create":
        if (!message.content.data.patients.includes(patientId)) {
          break;
        }
        setDatas([...datas, message.content.data]);
        break;
      case "update":
        if (!message.content.data.patients.includes(patientId)) {
          break;
        }
        setDatas(
          datas.map((item) =>
            item.id === message.content.id ? message.content.data : item
          )
        );
        break;
      case "delete":
        setDatas(datas.filter((item) => item.id !== message.content.id));
        break;
      case "refresh":
        setDatas([...datas]);
        break;
      default:
        break;
    }
  } else if (message.route === "VACCINES") {
    setDatas(message.content.data);
  } else {
    switch (message.action) {
      case "create":
        if (message.content.data.patient_id !== patientId) {
          break;
        }
        setDatas([...datas, message.content.data]);
        break;
      case "update":
        if (message.content.data.patient_id !== patientId) {
          break;
        }
        setDatas(
          datas.map((item) =>
            item.id === message.content.id ? message.content.data : item
          )
        );
        break;
      case "delete":
        setDatas(datas.filter((item) => item.id !== message.content.id));
        break;
      default:
        break;
    }
  }
};
