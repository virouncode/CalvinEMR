export const filterAndSortMessages = (section, datas, userId) => {
  let newMessages = [];
  switch (section) {
    case "Inbox":
      newMessages = datas.filter(
        (message) =>
          (message.from_id !== userId || message.replied) &&
          !message.deleted_by_ids.includes(userId)
      );
      break;
    case "Sent messages":
      newMessages = datas.filter(
        (message) =>
          message.from_id === userId && !message.deleted_by_ids.includes(userId)
      );
      break;
    case "Deleted messages":
      newMessages = datas.filter(({ deleted_by_ids }) =>
        deleted_by_ids.includes(userId)
      );
      break;
    default:
      break;
  }
  newMessages.sort((a, b) => b.date_created - a.date_created);
  return newMessages;
};
