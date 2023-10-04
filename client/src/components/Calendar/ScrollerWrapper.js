import React, { useEffect, useRef, useState } from "react";
import EventForm from "../EventForm/EventForm";

const useFormScroller = (wrapperRef, scrollGrid, initialScrollTop) => {
  //function to add and remove scroll Listeners
  useEffect(() => {
    const handleScroll = (e) => {
      let scrollOffset = initialScrollTop - e.target.scrollTop;
      wrapperRef.current.style.transform = `translateY(${scrollOffset}px)`; //make the wrapper follow the mouse
    };
    scrollGrid.addEventListener("scroll", handleScroll);
    return () => {
      scrollGrid.removeEventListener("scroll", handleScroll);
    };
  }, [scrollGrid, initialScrollTop, wrapperRef]);
};

const ScrollerWrapper = ({
  formClass,
  scrollGrid,
  initialScrollTop,
  top,
  left,
  borderColor,
  staffInfos,
  patientsInfos,
  currentEvent,
  fpVisible,
  remainingStaff,
  passingFormRef,
  setFormVisible,
  putForm,
  setCalendarSelectable,
}) => {
  const [color, setColor] = useState("");
  const wrapperRef = useRef(null);
  useFormScroller(wrapperRef, scrollGrid, initialScrollTop);
  useEffect(() => {
    setColor(borderColor);
  }, [borderColor]);

  return (
    <div
      ref={wrapperRef}
      className={formClass}
      style={{
        position: "absolute",
        top: top,
        left: left,
        border: `solid 2px ${color}`,
      }}
    >
      <EventForm
        staffInfos={staffInfos}
        patientsInfos={patientsInfos}
        currentEvent={currentEvent}
        fpVisible={fpVisible}
        remainingStaff={remainingStaff}
        ref={passingFormRef}
        setColor={setColor}
        setFormVisible={setFormVisible}
        putForm={putForm}
        setCalendarSelectable={setCalendarSelectable}
      />
    </div>
  );
};

export default ScrollerWrapper;
