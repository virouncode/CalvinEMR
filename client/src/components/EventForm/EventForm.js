//Libraries
import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";

//API
import { getAvailableRooms } from "../../api/getAvailableRooms";
import axiosXano from "../../api/xano";

//Components
import EditGuests from "./EditGuests";
import FlatpickrStart from "./FlatpickrStart";
import FlatpickrEnd from "./FlatpickrEnd";
import HostsList from "./HostsList";
import RoomsRadio from "./RoomsRadio";
import { confirmAlert } from "../Confirm/ConfirmGlobal";
import StatusesRadio from "./StatusesRadio";
import Invitation from "./Invitation";
import DurationPicker from "../Pickers/DurationPicker";

//Utils
import { rooms } from "../../utils/rooms";
import { statuses } from "../../utils/statuses";
import useAuth from "../../hooks/useAuth";
import formatName from "../../utils/formatName";
import { useEventForm } from "../../hooks/useEventForm";
import { toast } from "react-toastify";
import { staffIdToTitleAndName } from "../../utils/staffIdToTitleAndName";

var _ = require("lodash");

//MY COMPONENT
const EventForm = forwardRef(
  //forward ref to be able to lift formDatas to the Calendar component
  (
    {
      currentEvent,
      staffInfos,
      patientsInfos,
      fpVisible,
      remainingStaff,
      setColor,
      setFormVisible,
      putForm,
      setCalendarSelectable,
    },
    ref
  ) => {
    const [{ formDatas, tempFormDatas }, , setTempFormDatas] = useEventForm(
      currentEvent.current.id
    );
    const [availableRooms, setAvailableRooms] = useState([]);
    const { auth, user, clinic } = useAuth();
    const fpStart = useRef(null); //flatpickr start date
    const fpEnd = useRef(null); //flatpickr end date
    const previousStart = useRef(currentEvent.current.start);
    const previousEnd = useRef(currentEvent.current.end);
    const [staffGuestsInfos, setStaffGuestsInfos] = useState([]);
    const [patientsGuestsInfos, setPatientsGuestsInfos] = useState([]);
    const [invitationVisible, setInvitationVisible] = useState(false);
    const [hostSettings, setHostSettings] = useState(null);

    useEffect(() => {
      const abortController = new AbortController();
      const fetchSettings = async () => {
        try {
          const response = await axiosXano.get(
            `/settings?staff_id=${currentEvent.current.extendedProps.host}`,
            {
              headers: {
                Authorization: `Bearer ${auth.authToken}`,
              },
              signal: abortController.signal,
            }
          );
          if (abortController.signal.aborted) return;
          setHostSettings(response.data);
        } catch (err) {
          if (err.name !== "CanceledError")
            toast.error(`Error: unable to fetch settings: ${err.message}`, {
              containerId: "A",
            });
        }
      };
      fetchSettings();
      return () => abortController.abort();
    }, [auth.authToken, currentEvent]);

    //available rooms
    useEffect(() => {
      const abortController = new AbortController();
      const fetchAvailableRooms = async () => {
        try {
          const response = await getAvailableRooms(
            parseInt(currentEvent.current.id),
            Date.parse(currentEvent.current.start),
            Date.parse(currentEvent.current.end),
            auth.authToken,
            abortController
          );
          if (abortController.signal.aborted) return;
          setAvailableRooms(response);
        } catch (err) {
          if (err.name !== "CanceledError")
            toast.error(`Error: unable to get available rooms ${err.message}`, {
              containerId: "A",
            });
          else console.log("aborted");
        }
      };
      fetchAvailableRooms();
      return () => {
        console.log("aborted");
        abortController.abort();
      };
    }, [auth.authToken, currentEvent]);

    //============================ HANDLERS ==========================//

    const handleChange = (e) => {
      const name = e.target.name;
      const value = e.target.value;
      currentEvent.current.setExtendedProp(name, value);
      setTempFormDatas({ ...tempFormDatas, [name]: value });
    };

    const handleHostChange = async (e) => {
      const name = e.target.name;
      const value = parseInt(e.target.value);
      currentEvent.current.setExtendedProp("host", value);

      if (value === user.id) {
        currentEvent.current.setProp("color", "#41A7F5");
        currentEvent.current.setProp("textColor", "#FEFEFE");
        setColor("#41A7F5");
      } else {
        const host = remainingStaff.find(({ id }) => id === value);
        currentEvent.current.setProp("color", host.color);
        currentEvent.current.setProp("textColor", host.textColor);
        setColor(host.color);
        //CHECK HOST IN THE FILTER !!!!!!!!!!
      }

      setTempFormDatas({ ...tempFormDatas, [name]: value });
    };

    const handleRoomChange = async (e) => {
      const name = e.target.name;
      const value = e.target.value;
      if (
        (isRoomOccupied(value) &&
          (await confirmAlert({
            content: `${value} will be occupied at this time slot, choose this room anyway ?`,
          }))) ||
        !isRoomOccupied(value)
      ) {
        currentEvent.current.setExtendedProp("room", value);
        currentEvent.current.setResources([
          rooms[_.findIndex(rooms, { title: value })].id,
        ]);
        setTempFormDatas({ ...tempFormDatas, [name]: value });
      }
    };

    const handleStartChange = async (selectedDates, dateStr, instance) => {
      if (selectedDates.length === 0) return; //if the flatpickr is cleared
      const date = Date.parse(selectedDates[0]);
      const endPicker = fpEnd.current.flatpickr;

      const rangeEnd =
        selectedDates[0] > new Date(tempFormDatas.end)
          ? date
          : tempFormDatas.end;
      //when i change time i want to know only the rooms occupied by others otherwise i will trigger confirm for nothing
      let hypotheticAvailableRooms;
      try {
        hypotheticAvailableRooms = await getAvailableRooms(
          parseInt(currentEvent.current.id),
          date,
          rangeEnd,
          auth.authToken
        );
      } catch (err) {
        toast.error(`Error: unable to get available rooms: ${err.message}`, {
          containerId: "A",
        });
        return;
      }
      if (
        tempFormDatas.room === "To be determined" ||
        hypotheticAvailableRooms.includes(tempFormDatas.room) ||
        (!hypotheticAvailableRooms.includes(tempFormDatas.room) &&
          (await confirmAlert({
            content: `${tempFormDatas.room} will be occupied at this time slot, change start time anyway ?`,
          })))
      ) {
        currentEvent.current.setStart(date);
        previousStart.current = date;
        endPicker.config.minDate = date;
        if (selectedDates[0] > new Date(tempFormDatas.end)) {
          currentEvent.current.setEnd(date);
          endPicker.setDate(date);
          setTempFormDatas({
            ...tempFormDatas,
            start: date,
            end: date,
            duration: 0,
          });
        } else {
          setTempFormDatas({
            ...tempFormDatas,
            start: date,
            duration: Math.floor((tempFormDatas.end - date) / (1000 * 60)),
          });
        }
      } else {
        instance.setDate(previousStart.current);
      }
    };

    const handleEndChange = async (selectedDates, dateStr, instance) => {
      if (selectedDates.length === 0) return; //if the flatpickr is cleared
      const date = Date.parse(selectedDates[0]); //remove ms for compareValues
      let hypotheticAvailableRooms;
      try {
        hypotheticAvailableRooms = await getAvailableRooms(
          parseInt(currentEvent.current.id),
          tempFormDatas.start,
          date,
          auth.authToken
        );
      } catch (err) {
        toast.error(`Error: unable to get available rooms: ${err.message}`, {
          containerId: "A",
        });
      }
      if (
        tempFormDatas.room === "To be determined" ||
        hypotheticAvailableRooms.includes(tempFormDatas.room) ||
        (!hypotheticAvailableRooms.includes(tempFormDatas.room) &&
          (await confirmAlert({
            content: `${tempFormDatas.room} will be occupied at this time slot, change end time anyway ?`,
          })))
      ) {
        currentEvent.current.setEnd(date); //re-render
        previousEnd.current = date;
        setTempFormDatas({
          ...tempFormDatas,
          end: date,
          duration: Math.floor((date - tempFormDatas.start) / (1000 * 60)),
        });
      } else {
        instance.setDate(previousEnd.current);
      }
    };

    const handleCheckAllDay = (e) => {
      if (e.target.checked) {
        currentEvent.current.setAllDay(true);
        setTempFormDatas({
          ...tempFormDatas,
          all_day: true,
          duration: 1440,
        });
        fpStart.current.flatpickr.clear();
        fpEnd.current.flatpickr.clear();
      } else {
        currentEvent.current.setAllDay(false);
        currentEvent.current.setStart(tempFormDatas.start); //get the original dates back
        currentEvent.current.setEnd(tempFormDatas.end);
        fpStart.current.flatpickr.setDate(tempFormDatas.start);
        fpEnd.current.flatpickr.setDate(tempFormDatas.end);
        setTempFormDatas({
          ...tempFormDatas,
          all_day: false,
          duration: Math.floor(
            (tempFormDatas.end - tempFormDatas.start) / (1000 * 60)
          ),
        });
      }
    };

    const handleDurationHoursChange = (e) => {
      const value = e.target.value;
      const hoursInt = value === "" ? 0 : parseInt(value);
      const minInt = parseInt(tempFormDatas.duration % 60);
      setTempFormDatas({
        ...tempFormDatas,
        duration: hoursInt * 60 + minInt,
        end: tempFormDatas.start + hoursInt * 3600000 + minInt * 60000,
      });
      currentEvent.current.setEnd(
        tempFormDatas.start + hoursInt * 3600000 + minInt * 60000
      );
    };
    const handleDurationMinChange = (e) => {
      const value = e.target.value;
      const hoursInt = parseInt(tempFormDatas.duration / 60);
      const minInt = value === "" ? 0 : parseInt(value);
      setTempFormDatas({
        ...tempFormDatas,
        duration: hoursInt * 60 + minInt,
        end: tempFormDatas.start + hoursInt * 3600000 + minInt * 60000,
      });
      currentEvent.current.setEnd(
        tempFormDatas.start + hoursInt * 3600000 + minInt * 60000
      );
    };

    const handleInvitation = async (e) => {
      e.preventDefault();
      setInvitationVisible(true);
    };

    //========================== FUNCTIONS ======================//
    const isRoomOccupied = (roomName) => {
      if (roomName === "To be determined") {
        return false;
      }
      return availableRooms.includes(roomName) ? false : true;
    };

    const isSecretary = () => {
      return user.title === "Secretary" ? true : false;
    };

    useImperativeHandle(ref, () => ({
      getFormState: () => {
        return {
          formDatas: formDatas,
          tempFormDatas: tempFormDatas,
        };
      },
    }));

    const handleCancel = (e) => {
      e.preventDefault();
      setTempFormDatas(formDatas);
      currentEvent.current.setExtendedProp("host", formDatas.host_id);
      currentEvent.current.setExtendedProp("reason", formDatas.reason);
      currentEvent.current.setExtendedProp("status", formDatas.status);
      currentEvent.current.setStart(formDatas.start);
      currentEvent.current.setEnd(formDatas.end);
      currentEvent.current.setAllDay(formDatas.all_day);
      currentEvent.current.setExtendedProp("room", formDatas.room);
      currentEvent.current.setResources([
        rooms[_.findIndex(rooms, { title: formDatas.room })].id,
      ]);
      setFormVisible(false);
      setCalendarSelectable(true);
    };

    const handleConfirm = (e) => {
      e.preventDefault();
      putForm();
      setFormVisible(false);
      setCalendarSelectable(true);
    };

    return (
      formDatas && (
        <form
          className={
            isSecretary() || currentEvent.current.extendedProps.host === user.id
              ? "form"
              : "form form-uneditable"
          }
        >
          <div className="form-row">
            <div className="form-row-section">
              <label>Host </label>
              {isSecretary() ? (
                <HostsList
                  staffInfos={staffInfos}
                  handleHostChange={handleHostChange}
                  hostId={tempFormDatas.host_id}
                />
              ) : (
                <p>
                  {staffIdToTitleAndName(
                    clinic.staffInfos,
                    tempFormDatas.host_id
                  )}
                </p>
              )}
            </div>
            <div className="form-row-section">
              <label htmlFor="reason">Reason</label>
              <input
                type="text"
                value={tempFormDatas.reason}
                onChange={handleChange}
                name="reason"
                id="reason"
                autoComplete="off"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-row-section">
              <FlatpickrStart
                fpStart={fpStart}
                startTime={tempFormDatas.start}
                handleStartChange={handleStartChange}
                fpVisible={fpVisible}
                allDay={tempFormDatas.all_day}
              />
            </div>
            <div className="form-row-section">
              <FlatpickrEnd
                fpEnd={fpEnd}
                start={currentEvent.current.start}
                endTime={tempFormDatas.end}
                allDay={currentEvent.current.allDay}
                fpVisible={fpVisible}
                handleEndChange={handleEndChange}
              />
            </div>
          </div>
          <div className="form-row-duration">
            <DurationPicker
              durationHours={
                tempFormDatas.all_day
                  ? ""
                  : parseInt(tempFormDatas.duration / 60).toString()
              }
              durationMin={
                tempFormDatas.all_day
                  ? ""
                  : parseInt(tempFormDatas.duration % 60).toString()
              }
              disabled={tempFormDatas.all_day}
              handleDurationHoursChange={handleDurationHoursChange}
              handleDurationMinChange={handleDurationMinChange}
            />
          </div>
          <div className="form-all-day">
            <label>All Day</label>
            <input
              type="checkbox"
              className="all-day-checkbox"
              checked={tempFormDatas.all_day}
              onChange={handleCheckAllDay}
            />
          </div>
          <div className="form-row">
            <EditGuests
              staffInfos={staffInfos}
              patientsInfos={patientsInfos}
              tempFormDatas={tempFormDatas}
              setTempFormDatas={setTempFormDatas}
              currentEvent={currentEvent}
              editable={isSecretary() || user.id === tempFormDatas.host_id}
              hostId={tempFormDatas.host_id}
              staffGuestsInfos={staffGuestsInfos}
              setStaffGuestsInfos={setStaffGuestsInfos}
              patientsGuestsInfos={patientsGuestsInfos}
              setPatientsGuestsInfos={setPatientsGuestsInfos}
            />
          </div>
          <div className="form-row">
            <div className="form-row-section-rooms">
              <RoomsRadio
                handleRoomChange={handleRoomChange}
                roomSelected={tempFormDatas.room}
                rooms={rooms}
                isRoomOccupied={isRoomOccupied}
              />
            </div>
            <div className="form-row-section-statuses">
              <StatusesRadio
                handleStatusChange={handleChange}
                statuses={statuses}
                selectedStatus={tempFormDatas.status}
              />
            </div>
          </div>
          <div className="form-row form-row-invitation">
            <button onClick={handleConfirm}>Ok</button>
            <button onClick={handleCancel}>Cancel</button>
            <button
              onClick={handleInvitation}
              disabled={!staffGuestsInfos.length && !patientsGuestsInfos.length}
            >
              Send invitation
            </button>
            {invitationVisible && (
              <Invitation
                setInvitationVisible={setInvitationVisible}
                hostId={tempFormDatas.host_id}
                staffInfos={staffInfos}
                start={tempFormDatas.start}
                end={tempFormDatas.end}
                patientsGuestsInfos={patientsGuestsInfos}
                staffGuestsInfos={staffGuestsInfos}
                settings={hostSettings}
              />
            )}
          </div>
        </form>
      )
    );
  }
);

export default EventForm;
