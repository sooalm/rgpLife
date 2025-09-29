import React from "react";
import "../../styles/HomePage.css";

import GraphCon from "./GraphCon.jsx";
import Profile from "./Profile.jsx";

const HomePage = () => {
  return (
    <div className="homepage-flex-row">
      <Profile />
      <GraphCon />
    </div>
  );
};

export default HomePage;
