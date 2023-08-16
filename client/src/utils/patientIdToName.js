export const patientIdToName = (patientInfos, patientId) => {
  return patientInfos.find(({ id }) => id === patientId).full_name;
};
