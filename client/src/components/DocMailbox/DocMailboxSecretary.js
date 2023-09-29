import React, { useState } from "react";
import DocMailboxFormSecretary from "./DocMailboxFormSecretary";

const DocMailboxSecretary = () => {
  const [errMsg, setErrMsg] = useState("");
  return (
    <>
      <h1 className="docinbox-title">Documents Mailbox</h1>
      {errMsg && <p className="docinbox-err">{errMsg}</p>}
      <DocMailboxFormSecretary errMsg={errMsg} setErrMsg={setErrMsg} />
    </>
  );
};

export default DocMailboxSecretary;
