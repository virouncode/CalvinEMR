export const staffIdToName = (staffInfos, staffId) => {
  if (staffId === 0) return "";
  return staffInfos.find(({ id }) => id === staffId)?.full_name;
};
