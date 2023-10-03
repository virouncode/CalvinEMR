//Librairies
import React, { useEffect, useRef, useState } from "react";
//Components
import DocMailboxItem from "./DocMailboxItem";
import { CircularProgress } from "@mui/material";
import DocMailboxForm from "./DocMailboxForm";
import useAuth from "../../hooks/useAuth";
import axiosXano from "../../api/xano";
import { toast } from "react-toastify";
import DocMailboxAssignedPracticianForward from "./DocMailboxAssignedPracticianForward";

const DocMailboxTable = () => {
  //HOOKS
  const { user, auth, clinic } = useAuth();
  const editCounter = useRef(0);
  const [documents, setDocuments] = useState(null);
  const [addVisible, setAddVisible] = useState(false);
  const [forwardVisible, setForwardVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [columnToSort, setColumnToSort] = useState("date_created");
  const direction = useRef(false);
  const [assignedId, setAssignedId] = useState(0);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchDocMailbox = async () => {
      try {
        const response = await axiosXano.get(
          `/documents_for_staff?staff_id=${user.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
            signal: abortController.signal,
          }
        );
        if (abortController.signal.aborted) return;
        setDocuments(response.data.filter(({ acknowledged }) => !acknowledged));
      } catch (err) {
        if (err.name !== "CanceledError")
          toast.error(`Error: unable to get inbox documents: ${err.message}`, {
            containerId: "A",
          });
      }
    };
    fetchDocMailbox();
    return () => abortController.abort();
  }, [auth.authToken, user.id]);

  const showDocument = async (docUrl, docMime) => {
    let docWindow;
    if (!docMime.includes("officedocument")) {
      docWindow = window.open(
        docUrl,
        "_blank",
        "resizable=no, toolbar=no, scrollbars=no, menubar=no, status=no, directories=no, width=800, height=600, left=320, top=200"
      );
    } else {
      docWindow = window.open(
        `https://docs.google.com/gview?url=${docUrl}`,
        "_blank",
        "resizable=no, toolbar=no, scrollbars=no, menubar=no, status=no, directories=no, width=800, height=600, left=320, top=200"
      );
    }

    if (docWindow === null) {
      alert("Please disable your browser pop-up blocker and sign in again");
      window.location.assign("/login");
      return;
    }
  };

  //HANDLERS
  const handleSort = (columnName) => {
    direction.current = !direction.current;
    setColumnToSort(columnName);
    setDocuments([...documents]);
  };

  const handleAdd = (e) => {
    setErrMsg("");
    editCounter.current += 1;
    setAddVisible((v) => !v);
  };

  const handleCheckPractician = (e) => {
    setErrMsg("");
    setAssignedId(parseInt(e.target.id));
  };

  const isPracticianChecked = (id) => {
    return assignedId === parseInt(id);
  };

  return (
    <>
      {!isLoading ? (
        documents && (
          <>
            <h1 className="docmailbox-title">Documents Mailbox</h1>
            {errMsg && <div className="docmailbox-err">{errMsg}</div>}
            <table className="docmailbox-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("description")}>Description</th>
                  <th onClick={() => handleSort("name")}>File Name</th>
                  <th onClick={() => handleSort("type")}>Type</th>
                  <th onClick={() => handleSort("patient_id")}>
                    Related patient
                  </th>
                  <th onClick={() => handleSort("created_by_id")}>
                    Created By
                  </th>
                  <th onClick={() => handleSort("date_created")}>Created On</th>
                  <th style={{ textDecoration: "none", cursor: "default" }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {columnToSort === "name" || columnToSort === "type"
                  ? direction.current
                    ? documents
                        .sort((a, b) =>
                          a.file[columnToSort]
                            ?.toString()
                            .localeCompare(b.file[columnToSort]?.toString())
                        )
                        .map((document) => (
                          <DocMailboxItem
                            item={document}
                            key={document.id}
                            showDocument={showDocument}
                            setErrMsg={setErrMsg}
                            setDocuments={setDocuments}
                            setForwardVisible={setForwardVisible}
                            forwardVisible={forwardVisible}
                          />
                        ))
                    : documents
                        .sort((a, b) =>
                          b.file[columnToSort]
                            ?.toString()
                            .localeCompare(a.file[columnToSort]?.toString())
                        )
                        .map((document) => (
                          <DocMailboxItem
                            item={document}
                            key={document.id}
                            showDocument={showDocument}
                            setErrMsg={setErrMsg}
                            setDocuments={setDocuments}
                            setForwardVisible={setForwardVisible}
                            forwardVisible={forwardVisible}
                          />
                        ))
                  : direction.current
                  ? documents
                      .sort((a, b) =>
                        a[columnToSort]
                          ?.toString()
                          .localeCompare(b[columnToSort]?.toString())
                      )
                      .map((document) => (
                        <DocMailboxItem
                          item={document}
                          key={document.id}
                          showDocument={showDocument}
                          setErrMsg={setErrMsg}
                          setDocuments={setDocuments}
                          setForwardVisible={setForwardVisible}
                          forwardVisible={forwardVisible}
                        />
                      ))
                  : documents
                      .sort((a, b) =>
                        b[columnToSort]
                          ?.toString()
                          .localeCompare(a[columnToSort]?.toString())
                      )
                      .map((document) => (
                        <DocMailboxItem
                          item={document}
                          key={document.id}
                          showDocument={showDocument}
                          setErrMsg={setErrMsg}
                          setDocuments={setDocuments}
                          setForwardVisible={setForwardVisible}
                          forwardVisible={forwardVisible}
                        />
                      ))}
              </tbody>
            </table>
            <div className="docmailbox-btn-container">
              <button
                disabled={addVisible || forwardVisible}
                onClick={handleAdd}
              >
                Upload a document
              </button>
            </div>
            {addVisible && (
              <DocMailboxForm
                setAddVisible={setAddVisible}
                setErrMsg={setErrMsg}
                setDocuments={setDocuments}
              />
            )}
            {forwardVisible && (
              <DocMailboxAssignedPracticianForward
                staffInfos={clinic.staffInfos}
                handleCheckPractician={handleCheckPractician}
                isPracticianChecked={isPracticianChecked}
                assignedId={assignedId}
                setForwardVisible={setForwardVisible}
                setDocuments={setDocuments}
              />
            )}
          </>
        )
      ) : (
        <CircularProgress />
      )}
    </>
  );
};

export default DocMailboxTable;
