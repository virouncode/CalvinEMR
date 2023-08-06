import formatName from "./formatName";

export const patientIdToName = (patientInfos, patientId) => {
  return formatName(patientInfos.find(({ id }) => id === patientId).full_name);
};
