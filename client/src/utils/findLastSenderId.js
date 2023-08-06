//find last sender that is not user

export const findLastSenderId = (message, previousMsgs, userId) => {
  if (!previousMsgs.length) {
    return message.from_id;
  } else {
    let i = previousMsgs.length - 1;
    while (previousMsgs[i].from_id === userId && i > 0) {
      i--;
    }
    return previousMsgs[i].from_id;
  }
};
