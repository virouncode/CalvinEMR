//Librairies
import React, { useState, useEffect } from "react";
//Utils
import useAuth from "../../hooks/useAuth";

const Welcome = () => {
  //=================== STATES =======================//
  const [helloMessage, setHelloMessage] = useState("");
  const { user } = useAuth();

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
    user.id && (
      <div className="welcome">
        <h2>New Life Fertility Center</h2>
        <div>
          {helloMessage}
          {", "}
          {user.title === "Doctor" && "Dr. "}
          {user.name}
        </div>
      </div>
    )
  );
};

export default Welcome;
