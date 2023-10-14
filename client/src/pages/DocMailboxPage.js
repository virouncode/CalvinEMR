import React from "react";
import { Helmet } from "react-helmet";
import DocMailbox from "../components/DocMailbox/DocMailbox";
import DocMailboxSecretary from "../components/DocMailbox/DocMailboxSecretary";
import useAuth from "../hooks/useAuth";

const DocMailboxPage = () => {
  const { user } = useAuth();
  return (
    <>
      <Helmet>
        <title>Documents Mailbox</title>
      </Helmet>
      <section className="docmailbox-section">
        <h2 className="docmailbox-section__title">Documents Mailbox</h2>
        {user.title === "Secretary" ? <DocMailboxSecretary /> : <DocMailbox />}
      </section>
    </>
  );
};

export default DocMailboxPage;
