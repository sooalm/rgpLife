import React from "react";
import "../../App.css";
import gearsLogo from "../../assets/gears.svg";

import GraphCon from "../GraphCon.jsx";
import Profile from "../Profile.jsx";

const HomePage = () => {
  return (
    <div className="app-gridContainer">
      <Profile />
      <GraphCon />

      <h2>Under Construction</h2>
      <img src={gearsLogo} className="logo" alt="Under construction" />
    </div>
  );
};

export default HomePage;
