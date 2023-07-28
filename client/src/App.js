import logo from "./logo.svg";
import "./App.css";
import React, { useState } from "react";

function App() {
  const [msg, setMsg] = useState();
  const handleClick = async () => {
    const response = await fetch("/api/viroun");
    const json = await response.json();
    console.log(json);
    setMsg(json.msg);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={handleClick}>Dis Bonjour</button>
        <p>{msg}</p>
      </header>
    </div>
  );
}

export default App;
