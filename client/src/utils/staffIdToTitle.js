export const staffIdToTitle = (staffInfos, staffId) => {
  return staffInfos.find(({ id }) => id === staffId).title === "Doctor"
    ? "Dr. "
    : "";
};
