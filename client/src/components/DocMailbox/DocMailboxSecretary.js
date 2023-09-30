import React, { useState } from "react";
import DocMailboxFormSecretary from "./DocMailboxFormSecretary";

const DocMailboxSecretary = () => {
  const [errMsg, setErrMsg] = useState("");
  return (
    <>
      <h1 className="docmailbox-title">Documents Mailbox</h1>
      {errMsg && <p className="docmailbox-err">{errMsg}</p>}
      <DocMailboxFormSecretary errMsg={errMsg} setErrMsg={setErrMsg} />
    </>
  );
};

export default DocMailboxSecretary;
