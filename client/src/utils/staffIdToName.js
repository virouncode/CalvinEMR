export const staffIdToName = (staffInfos, staffId) => {
  if (staffId === 0) return "Unknown";
  return staffInfos.find(({ id }) => id === staffId).full_name;
};
