import React from "react";
import { Helmet } from "react-helmet";
import DocMailboxSecretary from "../components/DocMailbox/DocMailboxSecretary";
import DocMailboxTable from "../components/DocMailbox/DocMailboxTable";
import useAuth from "../hooks/useAuth";

const DocMailboxPage = () => {
  const { user } = useAuth();
  return (
    <div>
      <Helmet>
        <title>Documents Mailbox</title>
      </Helmet>
      {user.title === "Secretary" ? (
        <DocMailboxSecretary />
      ) : (
        <DocMailboxTable />
      )}
    </div>
  );
};

export default DocMailboxPage;
