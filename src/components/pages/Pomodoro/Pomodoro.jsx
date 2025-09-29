import React from "react";

// import { TimeContextProvider } from "./TimeContextProvider";

import "../../../styles/Pomodoro.css";

import ProgressBar from "./ProgressBar";
// import StartProgress from "./StartProgress";

const Pomodoro = () => {
  return (
    <div className="pomodoro">
      <div className="pomodoro-container">
        {/* <TimeContextProvider> */}
        <ProgressBar />
        {/* </TimeContextProvider> */}
        {/* <img src={gearsLogo} className="logo" alt="Under construction" /> */}
      </div>
    </div>
  );
};

export default Pomodoro;
