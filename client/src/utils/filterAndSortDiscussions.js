export const filterAndSortDiscussions = (section, datas, userId) => {
  let newDiscussions = [];
  switch (section) {
    case "Inbox":
      newDiscussions = datas.filter(
        (discussion) =>
          (discussion.author_id !== userId || discussion.last_replier_id) &&
          !discussion.deleted_by_ids.includes(userId)
      );
      break;
    case "Sent messages":
      newDiscussions = datas.filter(
        (discussion) =>
          discussion.author_id === userId &&
          !discussion.last_replier_id &&
          !discussion.deleted_by_ids.includes(userId)
      );
      break;
    case "Deleted messages":
      newDiscussions = datas.filter(({ deleted_by_ids }) =>
        deleted_by_ids.includes(userId)
      );
      break;
    default:
      break;
  }
  newDiscussions.sort(
    (a, b) => new Date(b.date_updated) - new Date(a.date_updated)
  );
  return newDiscussions;
};
