//Librairies
import React, { useState, useEffect } from "react";
//Utils
import useAuth from "../../hooks/useAuth";

const Welcome = () => {
  //=================== STATES =======================//
  const [helloMessage, setHelloMessage] = useState("");
  const { auth } = useAuth();

  useEffect(() => {
    const displayHello = () => {
      const dateObj = new Date();
      const hour = dateObj.getHours();
      if (hour >= 5 && hour <= 12) {
        setHelloMessage("Good Morning");
      } else if (hour >= 13 && hour <= 17) {
        setHelloMessage("Good Afternoon");
      } else if (hour >= 18 && hour <= 21) {
        setHelloMessage("Good Evening");
      } else {
        setHelloMessage("Good Night");
      }
      setTimeout(() => {
        displayHello();
      }, "1800000"); //all half hour
    };
    displayHello();
  }, [setHelloMessage]);

  return (
    auth?.userId && (
      <div className="welcome">
        <h2>New Life Fertility Center</h2>
        <div>
          {helloMessage}
          {", "}
          {auth?.title === "Doctor" && "Dr. "}
          {auth?.userName}
        </div>
      </div>
    )
  );
};

export default Welcome;
