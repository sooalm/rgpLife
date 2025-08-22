import React from "react";
import { NavLink } from "react-router-dom";

const Navigation = () => {
  return (
    <div>
      <nav>
        <NavLink to=".">Profile</NavLink>
        <NavLink to="contacts">Pomodoro</NavLink>
        <NavLink to="about">About</NavLink>
        <NavLink to="courses">Courses</NavLink>
      </nav>
    </div>
  );
};

export default Navigation;
