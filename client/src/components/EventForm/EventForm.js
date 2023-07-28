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
import axios from "../../api/xano";

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
import { useAxiosFunction } from "../../hooks/useAxiosFunction";
import formatName from "../../utils/formatName";

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
    },
    ref
  ) => {
    const [
      formDatas,
      setFormDatas,
      error,
      loading,
      axiosFetch,
      tempFormDatas,
      setTempFormDatas,
    ] = useAxiosFunction();
    const [availableRooms, setAvailableRooms] = useState([]);
    const { auth } = useAuth();
    const fpStart = useRef(null); //flatpickr start date
    const fpEnd = useRef(null); //flatpickr end date
    const previousStart = useRef(currentEvent.current.start);
    const previousEnd = useRef(currentEvent.current.end);
    const abortControllerStart = useRef(null);
    const abortControllerEnd = useRef(null);
    const [staffGuestsInfos, setStaffGuestsInfos] = useState([]);
    const [patientsGuestsInfos, setPatientsGuestsInfos] = useState([]);
    const [invitationVisible, setInvitationVisible] = useState(false);
    const [hostSettings, setHostSettings] = useState(null);

    //formDatas
    useEffect(() => {
      axiosFetch({
        axiosInstance: axios,
        method: "GET",
        url: `/appointments/${currentEvent.current.id}`,
        authToken: auth?.authToken,
      });
      //eslint-disable-next-line
    }, [auth?.authToken, currentEvent]);

    useEffect(() => {
      const fetchSettings = async () => {
        const response = await axios.get(
          `/settings?staff_id=${currentEvent.current.extendedProps.host}`,
          {
            headers: {
              Authorization: `Bearer ${auth.authToken}`,
            },
          }
        );
        setHostSettings(response.data);
      };
      fetchSettings();
    }, [auth.authToken, currentEvent]);

    //available rooms
    useEffect(() => {
      const controller = new AbortController();
      const fetchAvailableRooms = async () => {
        setAvailableRooms(
          await getAvailableRooms(
            parseInt(currentEvent.current.id),
            Date.parse(currentEvent.current.start),
            Date.parse(currentEvent.current.end),
            auth?.authToken,
            controller
          )
        );
      };
      fetchAvailableRooms();
      return () => controller.abort();
    }, [auth?.authToken, currentEvent]);

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

      if (value === auth?.userId) {
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
      const hypotheticAvailableRooms = await getAvailableRooms(
        parseInt(currentEvent.current.id),
        date,
        rangeEnd,
        auth?.authToken
      );
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
        setTempFormDatas({ ...tempFormDatas, start: date });
        if (selectedDates[0] > new Date(tempFormDatas.end)) {
          currentEvent.current.setEnd(date);
          endPicker.setDate(date);
          setTempFormDatas({
            ...tempFormDatas,
            start: date,
            end: date,
            duration: 0,
          });
          if (abortControllerStart.current) {
            abortControllerStart.current.abort();
            abortControllerStart.current = null;
            console.log("aborted");
          }
          abortControllerStart.current = new AbortController();
          setAvailableRooms(
            await getAvailableRooms(
              parseInt(currentEvent.current.id),
              date,
              date,
              auth?.authToken,
              abortControllerStart.current
            )
          );
          abortControllerStart.current = null;
        } else {
          setTempFormDatas({
            ...tempFormDatas,
            start: date,
            duration: Math.floor((tempFormDatas.end - date) / (1000 * 60)),
          });
          if (abortControllerStart.current) {
            abortControllerStart.current.abort();
            abortControllerStart.current = null;
            console.log("aborted");
          }
          abortControllerStart.current = new AbortController();
          setAvailableRooms(
            await getAvailableRooms(
              parseInt(currentEvent.current.id),
              date,
              tempFormDatas.end,
              auth?.authToken,
              abortControllerStart.current
            )
          );
          abortControllerStart.current = null;
        }
      } else {
        instance.setDate(previousStart.current);
      }
    };

    const handleEndChange = async (selectedDates, dateStr, instance) => {
      if (selectedDates.length === 0) return; //if the flatpickr is cleared
      const date = Date.parse(selectedDates[0]); //remove ms for compareValues
      const hypotheticAvailableRooms = await getAvailableRooms(
        parseInt(currentEvent.current.id),
        tempFormDatas.start,
        date,
        auth?.authToken
      );
      if (
        tempFormDatas.room === "To be determined" ||
        hypotheticAvailableRooms.includes(tempFormDatas.room) ||
        (!hypotheticAvailableRooms.includes(tempFormDatas.room) &&
          (await confirmAlert({
            content: `${tempFormDatas.room} will be occupied at this time slot, change end time anyway ?`,
          })))
      ) {
        currentEvent.current.setEnd(date);
        previousEnd.current = date;
        setTempFormDatas({
          ...tempFormDatas,
          end: date,
          duration: Math.floor((date - tempFormDatas.start) / (1000 * 60)),
        });

        if (abortControllerEnd.current) {
          abortControllerEnd.current.abort();
          abortControllerEnd.current = null;
          console.log("aborted");
        }
        abortControllerEnd.current = new AbortController();
        setAvailableRooms(
          await getAvailableRooms(
            parseInt(currentEvent.current.id),
            tempFormDatas.start,
            date,
            auth?.authToken,
            abortControllerEnd.current
          )
        );
        abortControllerEnd.current = null;
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
      return auth?.title === "Secretary" ? true : false;
    };

    useImperativeHandle(ref, () => ({
      getFormState: () => {
        return {
          formDatas: formDatas,
          tempFormDatas: tempFormDatas,
        };
      },
    }));

    return (
      formDatas && (
        <form
          className={
            isSecretary() ||
            currentEvent.current.extendedProps.host === auth?.userId
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
                  {tempFormDatas.host_title.title === "Doctor" ? "Dr. " : ""}{" "}
                  {formatName(tempFormDatas.host_name.full_name)}
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
              editable={isSecretary() || auth?.userId === tempFormDatas.host_id}
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
