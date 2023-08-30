export const patientIdToName = (patientsInfos, patientId) => {
  if (patientId === 0) return "Unknown";
  return patientsInfos.find(({ id }) => id === patientId).full_name;
};
