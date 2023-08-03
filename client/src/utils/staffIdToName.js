import formatName from "./formatName";

export const staffIdToName = (staffInfos, staffId) => {
  return formatName(staffInfos.find(({ id }) => id === staffId).full_name);
};
