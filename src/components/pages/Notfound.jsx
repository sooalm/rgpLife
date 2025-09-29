import React from "react";
import gearsLogo from "../../assets/gears.svg";
const Notfound = () => {
  return (
    <div>
      <h2>404 Not Found</h2>
      <img
        src={gearsLogo}
        style={{ width: "250px", height: "250px" }}
        className="logo"
        alt="Under construction"
      />
    </div>
  );
};

export default Notfound;
