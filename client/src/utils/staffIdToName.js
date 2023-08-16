export const staffIdToName = (staffInfos, staffId) => {
  return staffInfos.find(({ id }) => id === staffId).full_name;
};
