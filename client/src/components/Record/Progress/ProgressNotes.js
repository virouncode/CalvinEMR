//Librairies
import React, { useRef, useState } from "react";
//Components
import ProgressNotesCard from "./ProgressNotesCard";
import ProgressNotesForm from "./ProgressNotesForm";
//Hooks
import { usePatientRecord } from "../../../hooks/usePatientRecord";
//Utils
import { toLocalDateAndTimeWithSeconds } from "../../../utils/formatDates";
import ProgressNotesHeader from "./ProgressNotesHeader";
import ProgressNotesPU from "../Popups/ProgressNotesPU";
import NewWindow from "react-new-window";
import { CircularProgress } from "@mui/material";
import useAuth from "../../../hooks/useAuth";

const ProgressNotes = ({ patientInfos, allContentsVisible, patientId }) => {
  //hooks
  const { user } = useAuth();
  const [addVisible, setAddVisible] = useState(false);
  const [popUpVisible, setPopUpVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [checkedNotes, setCheckedNotes] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [allBodiesVisible, setAllBodiesVisible] = useState(false);
  const [order, setOrder] = useState(
    user.settings.progress_notes_order ?? "top"
  );
  const contentRef = useRef(null);
  const triangleRef = useRef(null);

  const [
    { datas: progressNotes, isLoading, errMsg },
    fetchRecord,
    setProgressNotes,
  ] = usePatientRecord("/patient_progress_notes", patientId);

  const checkAllNotes = () => {
    const allNotesIds = progressNotes.map(({ id }) => id);
    setCheckedNotes(allNotesIds);
  };

  return (
    <section className="progress-notes">
      {console.log(progressNotes)}
      <ProgressNotesHeader
        patientInfos={patientInfos}
        allContentsVisible={allContentsVisible}
        contentRef={contentRef}
        triangleRef={triangleRef}
        addVisible={addVisible}
        setAddVisible={setAddVisible}
        search={search}
        setSearch={setSearch}
        checkedNotes={checkedNotes}
        setCheckedNotes={setCheckedNotes}
        checkAllNotes={checkAllNotes}
        setPopUpVisible={setPopUpVisible}
        selectAll={selectAll}
        setSelectAll={setSelectAll}
        progressNotes={progressNotes}
        allBodiesVisible={allBodiesVisible}
        setAllBodiesVisible={setAllBodiesVisible}
        order={order}
        setOrder={setOrder}
      />
      {popUpVisible && (
        <NewWindow
          title="Patient progress notes"
          features={{
            toolbar: "no",
            scrollbars: "no",
            menubar: "no",
            status: "no",
            directories: "no",
            width: 793.7,
            height: 1122.5,
            left: 320,
            top: 200,
          }}
          onUnload={() => setPopUpVisible(false)}
        >
          <ProgressNotesPU
            patientInfos={patientInfos}
            progressNotes={progressNotes}
            checkedNotes={checkedNotes}
          />
        </NewWindow>
      )}

      <div
        className={
          allContentsVisible
            ? "progress-notes-content progress-notes-content--active"
            : "progress-notes-content"
        }
        ref={contentRef}
      >
        {progressNotes && addVisible && (
          <ProgressNotesForm
            setAddVisible={setAddVisible}
            fetchRecord={fetchRecord}
            patientId={patientId}
          />
        )}
        {!isLoading ? (
          errMsg ? (
            <p className="progress-notes-err">{errMsg}</p>
          ) : progressNotes && progressNotes.length ? (
            order === "top" ? (
              progressNotes
                .sort(
                  (a, b) =>
                    (b.date_updated ? b.date_updated : b.date_created) -
                    (a.date_updated ? a.date_updated : a.date_created)
                )
                .filter(
                  (note) =>
                    note.created_by_name?.full_name
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    note.updated_by_name?.full_name
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    note.object.toLowerCase().includes(search.toLowerCase()) ||
                    note.body.toLowerCase().includes(search.toLowerCase()) ||
                    toLocalDateAndTimeWithSeconds(note.date_created).includes(
                      search.toLowerCase()
                    ) ||
                    toLocalDateAndTimeWithSeconds(note.date_updated).includes(
                      search.toLowerCase()
                    )
                )
                .map((progressNote) => (
                  <ProgressNotesCard
                    progressNote={progressNote}
                    progressNotes={progressNotes}
                    setProgressNotes={setProgressNotes}
                    fetchRecord={fetchRecord}
                    patientId={patientId}
                    key={progressNote.id}
                    checkedNotes={checkedNotes}
                    setCheckedNotes={setCheckedNotes}
                    setSelectAll={setSelectAll}
                    allBodiesVisible={allBodiesVisible}
                  />
                ))
            ) : (
              progressNotes
                .sort(
                  (a, b) =>
                    (a.date_updated ? a.date_updated : a.date_created) -
                    (b.date_updated ? b.date_updated : b.date_created)
                )
                .filter(
                  (note) =>
                    note.created_by_name?.full_name
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    note.updated_by_name?.full_name
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    note.object.toLowerCase().includes(search.toLowerCase()) ||
                    note.body.toLowerCase().includes(search.toLowerCase()) ||
                    toLocalDateAndTimeWithSeconds(note.date_created).includes(
                      search.toLowerCase()
                    ) ||
                    toLocalDateAndTimeWithSeconds(note.date_updated).includes(
                      search.toLowerCase()
                    )
                )
                .map((progressNote) => (
                  <ProgressNotesCard
                    progressNote={progressNote}
                    progressNotes={progressNotes}
                    setProgressNotes={setProgressNotes}
                    fetchRecord={fetchRecord}
                    patientId={patientId}
                    key={progressNote.id}
                    checkedNotes={checkedNotes}
                    setCheckedNotes={setCheckedNotes}
                    setSelectAll={setSelectAll}
                    allBodiesVisible={allBodiesVisible}
                  />
                ))
            )
          ) : (
            !addVisible && (
              <div style={{ padding: "5px" }}>No progress notes</div>
            )
          )
        ) : (
          <CircularProgress size="1rem" style={{ margin: "5px" }} />
        )}
      </div>
    </section>
  );
};

export default ProgressNotes;
