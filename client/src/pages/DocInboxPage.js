import React from "react";
import { Helmet } from "react-helmet";
import DocInboxTable from "../components/DocInbox/DocInboxTable";

const DocInboxPage = () => {
  return (
    <div>
      <Helmet>
        <title>Calvin EMR Documents Inbox</title>
      </Helmet>
      <DocInboxTable />
    </div>
  );
};

export default DocInboxPage;
