import formatName from "./formatName";

export const staffIdListToTitleAndName = (staffInfos, staffIdList) => {
  return staffIdList
    .map(
      (staffId) =>
        (staffInfos.find(({ id }) => id === staffId).title === "Doctor"
          ? "Dr. "
          : "") +
        formatName(staffInfos.find(({ id }) => id === staffId).full_name)
    )
    .join(", ");
};
