export const filterAndSortExternalMessages = (section, datas, userType) => {
  let newMessages = [];
  switch (section) {
    case "Inbox":
      //messages qui proviennent de l'autre userType et non deleted par le user
      newMessages = datas
        .filter((message) => message.from_id.user_type !== userType)
        .filter(
          (message) =>
            !message.deleted_by_ids.find(
              ({ user_type }) => user_type === userType
            )
        );
      break;
    case "Sent messages":
      //messages qui proviennent de l'userType et non deleted par le user)
      newMessages = datas
        .filter((message) => message.from_id.user_type === userType)
        .filter(
          (message) =>
            !message.deleted_by_ids.find(
              ({ user_type }) => user_type === userType
            )
        );
      break;
    case "Deleted messages":
      newMessages = datas.filter(({ deleted_by_ids }) =>
        deleted_by_ids.find(({ user_type }) => user_type === userType)
      );
      break;
    default:
      break;
  }
  newMessages.sort((a, b) => b.date_created - a.date_created);
  return newMessages;
};
