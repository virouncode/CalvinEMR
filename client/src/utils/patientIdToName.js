export const patientIdToName = (patientsInfos, patientId) => {
  console.log(patientId);
  if (patientId === 0) return "Unknown";
  return patientsInfos.find(({ id }) => id === patientId).full_name;
};
