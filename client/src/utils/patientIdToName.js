export const patientIdToName = (patientsInfos, patientId) => {
  return patientsInfos.find(({ id }) => id === patientId).full_name;
};
