import React from "react";
import { Helmet } from "react-helmet";
import DocMailboxTable from "../components/DocMailbox/DocMailboxTable";
import useAuth from "../hooks/useAuth";
import DocMailboxSecretary from "../components/DocMailbox/DocMailboxSecretary";

const DocMailboxPage = () => {
  const { user } = useAuth();
  return (
    <div>
      <Helmet>
        <title>Calvin EMR Documents Mailbox</title>
      </Helmet>
      {console.log(user.title)}
      {user.title === "Secretary" ? (
        <DocMailboxSecretary />
      ) : (
        <DocMailboxTable />
      )}
    </div>
  );
};

export default DocMailboxPage;
