import React from "react";
import DocMailboxPracticiansListItemForward from "./DocMailboxPracticiansListItemForward";
import useAuth from "../../hooks/useAuth";

const DocMailboxPracticiansListForward = ({
  categoryInfos,
  handleCheckPractician,
  isPracticianChecked,
  categoryName,
}) => {
  const { user } = useAuth();
  return (
    <ul className="practicians-forward-category-list">
      {categoryInfos
        .filter(({ id }) => id !== user.id)
        .map((info) => (
          <DocMailboxPracticiansListItemForward
            info={info}
            key={info.id}
            handleCheckPractician={handleCheckPractician}
            isPracticianChecked={isPracticianChecked}
            categoryName={categoryName}
          />
        ))}
    </ul>
  );
};

export default DocMailboxPracticiansListForward;
