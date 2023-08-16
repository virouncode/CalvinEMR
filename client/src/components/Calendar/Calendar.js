//Libraries
import React, { useCallback, useEffect, useRef, useState } from "react";
import { CircularProgress } from "@mui/material";

//API
import axiosXano from "../../api/xano";
import { getAvailableRooms } from "../../api/getAvailableRooms";

//Components
import Shortcutpickr from "./Shortcutpickr";
import CalendarFilter from "./CalendarFilter";
import OutsideWrapper from "./OutsideWrapper";
import ScrollerWrapper from "./ScrollerWrapper";
import SlotSelect from "./SlotSelect";
import FirstDaySelect from "./FirstDaySelect";
import CalendarView from "./CalendarView";
import TimelineView from "./TimelineView";
import { confirmAlert } from "../Confirm/ConfirmGlobal";

//Utils
import { getWeekRange } from "../../utils/formatDates";
import { rooms } from "../../utils/rooms";
import formatName from "../../utils/formatName";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { staffIdToName } from "../../utils/staffIdToName";
import { staffIdToTitle } from "../../utils/staffIdToTitle";
import { useEvents } from "../../hooks/useEvents";

//Require
var _ = require("lodash");

//MY COMPONENT
const Calendar = ({ timelineVisible }) => {
  //====================== HOOKS =======================//
  const { clinic, auth, user } = useAuth();
  const [hostsIds, setHostsIds] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [formTop, setFormTop] = useState(0);
  const [formLeft, setFormLeft] = useState(0);
  const [formClass, setFormClass] = useState("");
  const fcRef = useRef(null); //fullcalendar
  const fpVisible = useRef(false); //flatpicker
  const formStateRef = useRef(null);
  const currentEvent = useRef(null);
  const currentEventElt = useRef(null);
  const currentView = useRef(null);
  const lastCurrentId = useRef("");
  const [rangeStart, setRangeStart] = useState(Date.parse(getWeekRange()[0]));
  const [rangeEnd, setRangeEnd] = useState(Date.parse(getWeekRange()[1]));
  const isSecretary = useCallback(() => {
    return user.title === "Secretary" ? true : false;
  }, [user.title]);
  const [
    { events, remainingStaff, isLoading, errMsg },
    fetchEvents,
    setEvents,
  ] = useEvents(hostsIds, rangeStart, rangeEnd, isSecretary(), user.id);

  useEffect(() => {
    if (lastCurrentId.current) {
      currentEvent.current = events.find(
        ({ id }) => id === lastCurrentId.current
      );
      currentEventElt.current = document.getElementsByClassName(
        `event-${lastCurrentId.current}`
      )[0];
      if (
        document.getElementsByClassName(`event-${lastCurrentId.current}`)[0]
      ) {
        document.getElementsByClassName(
          `event-${lastCurrentId.current}`
        )[0].style.opacity = 1;
      }
    }
  }, [events]);

  useEffect(() => {
    user.title === "Secretary"
      ? setHostsIds([0, ...clinic.staffInfos.map(({ id }) => id)])
      : setHostsIds([user.id]);
  }, [clinic.staffInfos, user.id, user.title]);

  useEffect(() => {
    const handleDelete = async (e) => {
      if (
        currentEvent.current &&
        (currentEvent.current.extendedProps.host === user.id ||
          isSecretary()) &&
        (e.key === "Backspace" || e.key === "Delete") &&
        !formVisible
      ) {
        if (
          await confirmAlert({
            content: "Do you really want to remove this event ?",
          })
        ) {
          try {
            await axiosXano.delete(`/appointments/${currentEvent.current.id}`, {
              headers: { Authorization: `Bearer ${auth.authToken}` },
            });
            toast.success("Deleted Successfully", { containerId: "A" });
            let newEvents = [...events];
            newEvents = newEvents.filter(
              ({ id }) => id !== currentEvent.current.id
            );
            setEvents(newEvents);
            setFormVisible(false);
            setCalendarSelectable(true);
            currentEvent.current = null;
            lastCurrentId.current = "";
          } catch (err) {
            toast.error(err.message, { containerId: "A" });
          }
        }
      }
    };
    document.addEventListener("keydown", handleDelete);
    return () => {
      document.removeEventListener("keydown", handleDelete);
    };
  }, [auth.authToken, user.id, events, formVisible, isSecretary, setEvents]);

  //====================== EVENTS HANDLERS ==========================//
  const handleDeleteEvent = async (e) => {
    if (
      await confirmAlert({
        content: "Do you really want to remove this event ?",
      })
    ) {
      try {
        await axiosXano.delete(`/appointments/${currentEvent.current.id}`, {
          headers: { Authorization: `Bearer ${auth.authToken}` },
        });
        toast.success("Deleted Successfully", { containerId: "A" });
        let newEvents = [...events];
        newEvents = newEvents.filter(
          ({ id }) => id !== currentEvent.current.id
        );
        setEvents(newEvents);
        setFormVisible(false);
        setCalendarSelectable(true);
        currentEvent.current = null;
        lastCurrentId.current = "";
      } catch (err) {
        toast.error(err.message, { containerId: "A" });
      }
    }
  };
  const renderEventContent = (info) => {
    const event = info.event;
    if (timelineVisible) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0 2px",
            alignItems: "center",
            fontSize: "0.7rem",
            fontWeight: "bold",
            overflow: "scroll",
          }}
        >
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "clip",
            }}
          >
            {event.extendedProps.reason ?? "Appointment"}
          </span>
          <i className="fa-solid fa-" onClick={handleDeleteEvent}></i>
        </div>
      );
    } else {
      let staffGuestsNames = event.extendedProps.staffGuestsNames ?? [];
      let patientsGuestsNames = event.extendedProps.patientsGuestsNames ?? [];
      let guestsCaption = "";
      let guestsList = "";

      if (patientsGuestsNames.length === 0) {
        //no patients
        if (staffGuestsNames.length === 0) {
          //no guests
          guestsCaption = "";
        } else if (staffGuestsNames.length === 1) {
          //one guest
          guestsCaption = "Guest: ";
          guestsList = staffGuestsNames[0];
        } else {
          //several guests
          guestsCaption = "Guests: ";
          guestsList = staffGuestsNames.join(", ");
        }
      } else if (patientsGuestsNames.length === 1) {
        //one patient
        if (staffGuestsNames.length === 0) {
          //no staff
          guestsCaption = "Patient: ";
          guestsList = patientsGuestsNames[0];
        } else {
          guestsCaption = "Guests: ";
          guestsList = [...staffGuestsNames, patientsGuestsNames[0]].join(", ");
        }
      } else {
        //several patients
        if (staffGuestsNames.length === 0) {
          //no staff
          guestsCaption = "Patients: ";
          guestsList = patientsGuestsNames.join(", ");
        } else {
          guestsCaption = "Guests: ";
          guestsList = [...staffGuestsNames, ...patientsGuestsNames].join(", ");
        }
      }

      const hostName = event.extendedProps.host
        ? formatName(staffIdToName(clinic.staffInfos, event.extendedProps.host))
        : "";

      const hostNameShort = formatName(hostName);

      let hostCaption = event.extendedProps.host
        ? staffIdToTitle(clinic.staffInfos, event.extendedProps.host)
        : "";
      if (hostCaption === "Doctor") {
        hostCaption = "Doctor: ";
      } else {
        hostCaption = "Host: ";
      }
      if (
        info.view.type === "timeGridWeek" ||
        info.view.type === "dayGridMonth" ||
        info.view.type === "multiMonthYear"
      ) {
        return (
          <div style={{ fontSize: "0.7rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0 2px",
              }}
            >
              <p
                style={{
                  padding: "0",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "clip",
                }}
              >
                {event.allDay ? "All Day" : info.timeText} -{" "}
                {event.extendedProps.reason ?? "Appointment"}
              </p>
              <i className="fa-solid fa-trash" onClick={handleDeleteEvent}></i>
            </div>
            {guestsCaption && (
              <div>
                <strong>{guestsCaption}</strong>
                {guestsList}
              </div>
            )}
            <div>
              <strong>{hostCaption}</strong>
              {hostNameShort}
            </div>
            <div>
              <strong>Room: </strong>
              {event.extendedProps.room}
            </div>
            <div>
              <strong>Status: </strong>
              {event.extendedProps.status}
            </div>
          </div>
        );
      } else if (info.view.type === "timeGrid") {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0 2px",
              alignItems: "center",
              fontSize: "0.7rem",
            }}
          >
            <div>
              {event.allDay ? "All Day" : info.timeText}
              <span style={{ marginLeft: "10px" }}>
                <strong>Reason: </strong>
                {event.extendedProps.reason ?? "Appointment"}
              </span>
              {guestsCaption && (
                <span>
                  {" "}
                  / <strong>{guestsCaption}</strong>
                  {guestsList}
                </span>
              )}{" "}
              / <strong>{hostCaption}</strong>
              {hostNameShort} / <strong>Room: </strong>
              {event.extendedProps.room} / <strong>Status: </strong>
              {event.extendedProps.status}
            </div>
            <i className="fa-solid fa-trash" onClick={handleDeleteEvent}></i>
          </div>
        );
      } else if (info.view.type === "listWeek") {
        return (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p
                style={{
                  padding: "0",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "clip",
                }}
              >
                <strong>Reason: </strong>
                {event.extendedProps.reason ?? "Appointment"}
              </p>
              <i
                className="fa-solid fa-trash"
                onClick={handleDeleteEvent}
                style={{ cursor: "pointer" }}
              ></i>
            </div>
            {guestsCaption && (
              <div>
                <strong>{guestsCaption}</strong>
                {guestsList}
              </div>
            )}
            <div>
              <strong>{hostCaption}</strong>
              {hostNameShort}
            </div>
            <div>
              <strong>Room: </strong>
              {event.extendedProps.room}
            </div>
            <div>
              <strong>Status: </strong>
              {event.extendedProps.status}
            </div>
          </>
        );
      }
    }
  };

  //DATES SET
  const handleDatesSet = async (info) => {
    setRangeStart(Date.parse(info.startStr));
    setRangeEnd(Date.parse(info.endStr));
    currentEvent.current = null;
    lastCurrentId.current = "";
    currentEventElt.current = null;
    currentView.current = info.view;
  };

  //DATE SELECT
  const handleDateSelect = async (info) => {
    if (currentEventElt.current) currentEventElt.current.style.opacity = 0.65;
    const startDate = Date.parse(info.startStr);
    const endDate = Date.parse(info.endStr);

    const startAllDay = new Date(new Date(startDate).setHours(0, 0, 0, 0));
    let endAllDay = new Date(startAllDay);
    endAllDay = endAllDay.setDate(endAllDay.getDate() + 1);

    let datas = {};
    let newEvent = {
      start: info.allDay ? startAllDay : new Date(startDate),
      end: info.allDay ? endAllDay : new Date(endDate),
      allDay: info.allDay,
      extendedProps: {
        host: isSecretary() ? 0 : user.id,
        duration: info.allDay
          ? 1440
          : Math.floor((endDate - startDate) / (1000 * 60)),
        reason: "Appointment",
        status: "Scheduled",
      },
      color: isSecretary() ? "#bfbfbf" : "#41A7F5",
      textColor: "#FEFEFE",
    };

    if (timelineVisible) {
      let availableRooms;
      try {
        availableRooms = await getAvailableRooms(
          0,
          startDate,
          endDate,
          auth.authToken
        );
      } catch (err) {
        toast.error(err.message, { containerId: "A" });
        return;
      }
      if (
        info.resource.title === "To be determined" ||
        availableRooms.includes(info.resource.title) ||
        (!availableRooms.includes(info.resource.title) &&
          (await confirmAlert({
            content: `${info.resource.title} will be occupied at this time slot, choose it anyway ?`,
          })))
      ) {
        newEvent.resourceId = info.resource.id;
        newEvent.extendedProps.room = info.resource.title;
        fcRef.current.calendar.addEvent(newEvent);
        fcRef.current.calendar.unselect();

        datas = {
          host_id: newEvent.extendedProps.host,
          start: Date.parse(newEvent.start),
          end: Date.parse(newEvent.end),
          duration: newEvent.extendedProps.duration,
          all_day: newEvent.allDay,
          staff_guests: [],
          patients_guests: [],
          status: newEvent.extendedProps.status,
          reason: newEvent.extendedProps.reason,
          room: newEvent.extendedProps.room,
          created_by_id: user.id,
          date_created: Date.parse(new Date()),
        };

        try {
          const response = await axiosXano.post("/appointments", datas, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
          });
          toast.success("Saved Successfully", { containerId: "A" });
          const abortController = new AbortController();
          fetchEvents(abortController);
          lastCurrentId.current = response.data.id.toString();
        } catch (err) {
          if (err.name !== "CanceledError")
            toast.error(err.message, { containerId: "A" });
        }
      }
    } else {
      newEvent.resourceId = "z";
      newEvent.extendedProps.room = "To be determined";
      fcRef.current.calendar.addEvent(newEvent);
      fcRef.current.calendar.unselect();
      datas = {
        host_id: newEvent.extendedProps.host,
        start: newEvent.start,
        end: newEvent.end,
        duration: newEvent.extendedProps.duration,
        all_day: newEvent.allDay,
        staff_guests: [],
        patients_guests: [],
        status: newEvent.extendedProps.status,
        reason: newEvent.extendedProps.reason,
        room: newEvent.extendedProps.room,
        created_by_id: user.id,
        date_created: Date.parse(new Date()),
      };
      try {
        const response = await axiosXano.post(
          "/appointments",
          JSON.stringify(datas),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
          }
        );
        toast.success("Saved Successfully", { containerId: "A" });
        const abortController = new AbortController();
        fetchEvents(abortController);
        lastCurrentId.current = response.data.id.toString();
      } catch (err) {
        if (err.name !== "CanceledError")
          toast.error(err.message, { containerId: "A" });
      }
    }
  };

  //DRAG AND DROP
  const handleDragStart = (info) => {
    if (!currentEvent.current) {
      return;
    }
    setFormVisible(false);
    if (currentEvent.current.id !== info.event.id) {
      currentEventElt.current.style.opacity = 0.65;
    }
  };

  const handleDrop = async (info) => {
    const event = info.event;
    const eventElt = info.el;
    if (currentEventElt.current) currentEventElt.current.style.opacity = 0.65;
    info.el.style.opacity = "1";
    currentEvent.current = event;
    lastCurrentId.current = event.id;
    currentEventElt.current = eventElt;
    const startDate = Date.parse(event.start);
    const endDate = Date.parse(event.end);
    let availableRooms;
    try {
      availableRooms = await getAvailableRooms(
        parseInt(event.id),
        startDate,
        endDate,
        auth.authToken
      );
    } catch (err) {
      toast.error(err.message, { containerId: "A" });
      return;
    }
    const startAllDay = event.start.setHours(0, 0, 0, 0);
    const endAllDay = event.end.setHours(0, 0, 0, 0);
    let datas = {
      host_id: event.extendedProps.host,
      start: event.allDay ? startAllDay : startDate,
      end: event.allDay ? endAllDay : endDate,
      duration: event.allDay
        ? 1440
        : Math.floor((endDate - startDate) / (1000 * 60)),
      all_day: event.allDay,
      staff_guests: event.extendedProps.staffGuestsIds,
      patients_guests: event.extendedProps.patientsGuestsIds,
      status: event.extendedProps.status,
      reason: event.extendedProps.reason,
      created_by_id: user.id,
      date_created: Date.parse(new Date()),
    };

    if (!timelineVisible) {
      if (
        event.extendedProps.room === "To be determined" ||
        availableRooms.includes(event.extendedProps.room) ||
        (!availableRooms.includes(event.extendedProps.room) &&
          (await confirmAlert({
            content: `${event.extendedProps.room} will be occupied at this time slot, change schedule anyway?`,
          })))
      ) {
        datas.room = event.extendedProps.room;
        try {
          await axiosXano.put(`/appointments/${event.id}`, datas, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
          });
          toast.success("Saved Successfully", { containerId: "A" });
          const abortController = new AbortController();
          fetchEvents(abortController);
        } catch (err) {
          if (err.name !== "CanceledError")
            toast.error(err.message, { containerId: "A" });
        }
      } else {
        info.revert();
      }
    } else {
      const newRoom = info.newResource
        ? info.newResource.title
        : event.extendedProps.room;
      if (
        newRoom === "To be determined" ||
        availableRooms.includes(newRoom) ||
        (!availableRooms.includes(newRoom) &&
          (await confirmAlert({
            content: `${newRoom} will be occupied at this time slot, change schedule anyway?`,
          })))
      ) {
        event.setExtendedProp("room", newRoom);
        event.setResources([rooms[_.findIndex(rooms, { title: newRoom })].id]);
        datas.room = newRoom;
        try {
          await axiosXano.put(`/appointments/${event.id}`, datas, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
          });
          toast.success("Saved Successfully", { containerId: "A" });
          const abortController = new AbortController();
          fetchEvents(abortController);
        } catch (err) {
          if (err.name !== "CanceledError")
            toast.error(err.message, { containerId: "A" });
        }
      } else {
        info.revert();
      }
    }
  };

  //RESIZE
  const handleResizeStart = () => {
    setFormVisible(false);
  };

  const handleResize = async (info) => {
    const event = info.event;
    const eventElt = info.el;

    if (currentEventElt.current) currentEventElt.current.style.opacity = 0.65;
    info.el.style.opacity = "1";
    currentEvent.current = event;
    lastCurrentId.current = event.id;
    currentEventElt.current = eventElt;

    const startDate = Date.parse(event.start);
    const endDate = Date.parse(event.end);

    //same as a drop
    let availableRooms;
    try {
      availableRooms = await getAvailableRooms(
        parseInt(event.id),
        startDate,
        endDate,
        auth.authToken
      );
    } catch (err) {
      toast.error(err.message, { containerId: "A" });
      return;
    }
    const startAllDay = event.start.setHours(0, 0, 0, 0);
    const endAllDay = event.end.setHours(0, 0, 0, 0);

    if (
      event.extendedProps.room === "To be determined" ||
      availableRooms.includes(event.extendedProps.room) ||
      (!availableRooms.includes(event.extendedProps.room) &&
        (await confirmAlert({
          content: `${event.extendedProps.room} will be occupied at this time slot, change schedule anyway?`,
        })))
    ) {
      const datas = {
        host_id: event.extendedProps.host,
        start: event.allDay ? startAllDay : startDate,
        end: event.allDay ? endAllDay : endDate,
        duration: event.allDay
          ? 1440
          : Math.floor((endDate - startDate) / (1000 * 60)),
        all_day: event.allDay,
        staff_guests: event.extendedProps.staffGuestsIds,
        patients_guests: event.extendedProps.patientsGuestsIds,
        status: event.extendedProps.status,
        reason: event.extendedProps.reason,
        room: event.extendedProps.room,
        created_by_id: user.id,
        date_created: Date.parse(new Date()),
      };
      try {
        await axiosXano.put(`/appointments/${event.id}`, datas, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        });
        toast.success("Saved Successfully", { containerId: "A" });
        const abortController = new AbortController();
        fetchEvents(abortController);
      } catch (err) {
        if (err.name !== "CanceledError")
          toast.error(err.message, { containerId: "A" });
      }
    } else {
      info.revert();
    }
  };

  const handleEventClick = async (info) => {
    const eventElt = info.el;
    const event = info.event;
    const view = info.view;
    if (currentEvent.current && currentEvent.current.id !== event.id) {
      //change opacity and unselect previous event
      currentEventElt.current.style.opacity = 0.65;
      //Change current event, current event element and current view
      currentEvent.current = event;
      lastCurrentId.current = event.id;
      currentEventElt.current = eventElt;
      currentView.current = view;
      eventElt.style.opacity = "1";
    } else if (currentEvent.current === null) {
      //first event selection
      currentEvent.current = event;
      lastCurrentId.current = event.id;
      currentEventElt.current = eventElt;
      currentView.current = view;
      eventElt.style.opacity = "1";
    } else {
      if (!formVisible) {
        currentEvent.current = event;
        lastCurrentId.current = event.id;
        currentEventElt.current = eventElt;
        currentView.current = view;
        eventElt.style.opacity = "1";
        const eventPosition = eventElt.getBoundingClientRect();
        const eventWidth = eventElt.offsetWidth;
        const eventHeight = eventElt.offsetHeight;
        const eventPositionMiddleY = eventPosition.top + eventHeight / 2;
        placeForm(
          view,
          eventPosition,
          eventPositionMiddleY,
          eventWidth,
          eventHeight,
          event.allDay
        );
        setFormVisible(true);
        setCalendarSelectable(false);
      } else {
        setFormVisible(false);
        setCalendarSelectable(true);
        putForm();
      }
    }
  };
  const handleShortcutpickrChange = (selectedDates, dateStr) => {
    fcRef.current.calendar.gotoDate(dateStr);
  };

  //======================== FUNCTIONS ===================//
  const placeForm = (
    view,
    eventPosition,
    eventPositionMiddleY,
    eventWidth,
    eventHeight,
    allDay
  ) => {
    //Lateral
    let arrowSide = "";
    if (timelineVisible) {
      if (
        (view.type === "resourceTimelineDay" ||
          view.type === "resourceTimelineWeek") &&
        allDay
      ) {
        setFormLeft(window.innerWidth / 2 - 225);
      } else {
        if (eventPosition.right + 450 <= window.innerWidth) {
          //450 is form width
          setFormLeft(eventPosition.right + 2);
          arrowSide = "left";
        } else {
          setFormLeft(eventPosition.right - 450 - eventWidth - 3);
          arrowSide = "right";
        }
      }
      //Vertical
      if (eventPositionMiddleY + 325 >= window.innerHeight) {
        //325 is form height/2
        setFormTop(eventPosition.top + window.scrollY - 650 + eventHeight);
        setFormClass(`event-form event-form--${arrowSide}bottom`);
      } else if (eventPositionMiddleY - 325 <= 60) {
        setFormTop(eventPosition.top + window.scrollY);
        setFormClass(`event-form event-form--${arrowSide}top`);
      } else {
        setFormTop(eventPosition.top + window.scrollY - 325 + eventHeight / 2);
        setFormClass(`event-form event-form--${arrowSide}center`);
      }
    } else {
      if (
        view.type === "timeGridWeek" ||
        view.type === "dayGridMonth" ||
        view.type === "multiMonthYear"
      ) {
        if (eventPosition.right + 450 <= window.innerWidth) {
          //450 is form width
          setFormLeft(eventPosition.right + 2);
          arrowSide = "left";
        } else {
          setFormLeft(eventPosition.right - 450 - eventWidth - 3);
          arrowSide = "right";
        }
      } else if (view.type === "timeGrid" || view.type === "listWeek") {
        setFormLeft(eventPosition.right - eventWidth / 2);
        arrowSide = "left";
      }
      //Vertical
      if (eventPositionMiddleY + 325 >= window.innerHeight) {
        //depasse en bas
        //325 is form height/2
        setFormTop(eventPosition.top + window.scrollY - 650 + eventHeight);
        setFormClass(`event-form event-form--${arrowSide}bottom`);
      } else if (eventPositionMiddleY - 325 <= 60) {
        setFormTop(eventPosition.top + window.scrollY);
        setFormClass(`event-form event-form--${arrowSide}top`);
      } else {
        setFormTop(eventPosition.top + window.scrollY - 325 + eventHeight / 2);
        setFormClass(`event-form event-form--${arrowSide}center`);
      }
    }
  };

  const putForm = async () => {
    const { formDatas, tempFormDatas } = formStateRef.current.getFormState();
    if (_.isEqual(tempFormDatas, formDatas)) return;

    const startAllDay = new Date(tempFormDatas.start).setHours(0, 0, 0, 0);
    let endAllDay = new Date(startAllDay);
    endAllDay = endAllDay.setDate(endAllDay.getDate() + 1);

    const datas = {
      host_id: tempFormDatas.host_id,
      start: tempFormDatas.all_day ? startAllDay : tempFormDatas.start,
      end: tempFormDatas.all_day ? endAllDay : tempFormDatas.end,
      duration: tempFormDatas.duration,
      all_day: tempFormDatas.all_day,
      staff_guests: tempFormDatas.staff_guests,
      patients_guests: tempFormDatas.patients_guests,
      status: tempFormDatas.status,
      reason: tempFormDatas.reason,
      room: tempFormDatas.room,
      created_by_id: user.id,
      date_created: Date.parse(new Date()),
    };
    try {
      await axiosXano.put(`/appointments/${currentEvent.current.id}`, datas, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
      });
      toast.success("Saved Successfully", { containerId: "A" });
      setHostsIds([...hostsIds, tempFormDatas.host_id]);
      const abortController = new AbortController();
      fetchEvents(abortController);
    } catch (err) {
      if (err.name !== "CanceledError")
        toast.error(err.message, { containerId: "A" });
    }
  };

  const setCalendarSelectable = (selectable) => {
    fcRef.current.calendar.currentData.options.selectable = selectable;
  };

  return events && clinic.staffInfos ? (
    <main className="calendar">
      <section className="calendar-left-bar">
        <Shortcutpickr handleShortcutpickrChange={handleShortcutpickrChange} />
        <div className="calendar-left-bar-options">
          <p>Options</p>
          <SlotSelect />
          <FirstDaySelect />
        </div>
        <CalendarFilter
          staffInfos={clinic.staffInfos}
          hostsIds={hostsIds}
          setHostsIds={setHostsIds}
          remainingStaff={remainingStaff}
        />
      </section>
      <section className="calendar-display">
        {!timelineVisible ? (
          <CalendarView
            slotDuration={user.settings.slot_duration}
            firstDay={user.settings.first_day}
            fcRef={fcRef}
            isSecretary={isSecretary}
            events={events}
            handleDatesSet={handleDatesSet}
            handleDateSelect={handleDateSelect}
            handleDragStart={handleDragStart}
            handleEventClick={handleEventClick}
            handleDrop={handleDrop}
            handleResize={handleResize}
            handleResizeStart={handleResizeStart}
            renderEventContent={renderEventContent}
          />
        ) : (
          <TimelineView
            slotDuration={user.settings.slot_duration}
            firstDay={user.settings.first_day}
            fcRef={fcRef}
            isSecretary={isSecretary}
            events={events}
            handleDatesSet={handleDatesSet}
            handleDateSelect={handleDateSelect}
            handleDragStart={handleDragStart}
            handleEventClick={handleEventClick}
            handleDrop={handleDrop}
            handleResize={handleResize}
            handleResizeStart={handleResizeStart}
            renderEventContent={renderEventContent}
          />
        )}
        {formVisible && (
          <OutsideWrapper
            eventElement={currentEventElt}
            setFormVisible={setFormVisible}
            fpVisible={fpVisible}
            putForm={putForm}
            setCalendarSelectable={setCalendarSelectable}
            //put a ref on the modal
          >
            <ScrollerWrapper
              formClass={formClass}
              scrollGrid={
                currentView.current.type !== "multiMonthYear"
                  ? currentView.current.type !== "listWeek"
                    ? Array.from(
                        document.getElementsByClassName(
                          "fc-scroller fc-scroller-liquid-absolute"
                        )
                      )[0]
                    : document.getElementsByClassName(
                        "fc-scroller fc-scroller-liquid"
                      )[0]
                  : Array.from(
                      document.getElementsByClassName(
                        "fc-multiMonthYear-view fc-view fc-multimonth fc-multimonth-singlecol"
                      )
                    )[0]
              }
              initialScrollTop={
                currentView.current.type !== "multiMonthYear"
                  ? currentView.current.type !== "listWeek"
                    ? Array.from(
                        document.getElementsByClassName(
                          "fc-scroller fc-scroller-liquid-absolute"
                        )
                      )[0].scrollTop
                    : Array.from(
                        document.getElementsByClassName(
                          "fc-scroller fc-scroller-liquid"
                        )
                      )[0].scrollTop
                  : Array.from(
                      document.getElementsByClassName(
                        "fc-multiMonthYear-view fc-view fc-multimonth fc-multimonth-singlecol"
                      )
                    )[0].scrollTop
              }
              top={formTop}
              left={formLeft}
              borderColor={currentEvent.current.borderColor}
              staffInfos={clinic.staffInfos}
              patientsInfos={clinic.patientsInfos}
              currentEvent={currentEvent}
              fpVisible={fpVisible}
              remainingStaff={remainingStaff}
              passingFormRef={formStateRef}
            />
          </OutsideWrapper>
        )}
      </section>
    </main>
  ) : (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress />
    </div>
  );
};

export default Calendar;
