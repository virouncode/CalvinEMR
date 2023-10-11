export const staffIdToOhip = (staffInfos, staffId) => {
  if (staffId === 0) return "";
  console.log(staffInfos.find(({ id }) => id === staffId)?.ohip_billing_nbr);
  return staffInfos.find(({ id }) => id === staffId)?.ohip_billing_nbr;
};
