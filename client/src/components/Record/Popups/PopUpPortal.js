//Librairies
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const PopUpPortal = ({
  children,
  setPopUpVisible,
  popUpTitle,
  width = 800,
  left = 320,
  height = 600,
  top = 200,
}) => {
  const [container, setContainer] = useState(null);
  const newWindow = useRef(null);

  useEffect(() => {
    setContainer(document.createElement("div"));
  }, []);
  useEffect(() => {
    if (container) {
      newWindow.current = window.open(
        "",
        "_blank",
        `resizable=no, toolbar=no, scrollbars=no, menubar=no, status=no, directories=no, width=${width}, height=${height}, left=${left}, top=${top}`
      );
      if (newWindow.current === null) {
        alert("Please disable your browser pop-up blocker and sign in again");
        window.location.assign("*");
        return;
      }
      newWindow.current.document.body.appendChild(container);
      const currWindow = newWindow.current;
      currWindow.document.title = popUpTitle;
      currWindow.document.body.style.backgroundColor = "#FEFEFE";
      currWindow.onbeforeunload = (e) => setPopUpVisible(false);

      return () => {
        currWindow.close();
      };
    }
  }, [container, height, left, popUpTitle, setPopUpVisible, top, width]);
  return container && createPortal(children, container);
};

export default PopUpPortal;
