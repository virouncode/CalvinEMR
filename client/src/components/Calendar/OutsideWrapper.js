//Librairies
import React, { useRef, useEffect } from "react";

const useOutsideCloser = (
  wrapperRef,
  eventElement,
  fpVisible,
  setFormVisible,
  putForm,
  setCalendarSelectable
) => {
  //the function to add and remove outside click listeners
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        wrapperRef.current && //if the wrapper exists
        !wrapperRef.current.contains(e.target) && //if you click outside the wrapper
        !eventElement.current.contains(e.target) && //if you click outside the event element
        !fpVisible.current //if flatpicker calendar not visible
      ) {
        setFormVisible(false);
        putForm();
        setCalendarSelectable(true);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    fpVisible,
    setCalendarSelectable,
    setFormVisible,
    putForm,
    wrapperRef,
    eventElement,
  ]);
};

const OutsideWrapper = ({
  children,
  eventElement,
  fpVisible,
  setFormVisible,
  putForm,
  setCalendarSelectable,
}) => {
  const wrapperRef = useRef(null);
  useOutsideCloser(
    wrapperRef,
    eventElement,
    fpVisible,
    setFormVisible,
    putForm,
    setCalendarSelectable
  );
  return <div ref={wrapperRef}>{children}</div>; //we put the ref on the wrapper and the wrapper will wrap the form
};

export default OutsideWrapper;
