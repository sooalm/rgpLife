import React from "react";
import { NavLink, Outlet } from "react-router-dom";

import "../../styles/Layout.css";

const Layout = () => {
  return (
    <>
      <div className="app-container">
        <header className="header">
          <nav className="nav">
            <NavLink to="." className="nav__link">
              Главная
            </NavLink>
            <NavLink to="pomodoro" className="nav__link">
              Рабочая сессия
            </NavLink>
            <NavLink to="tasks" className="nav__link">
              Задачи
            </NavLink>
            <NavLink to="achievements" className="nav__link">
              Достижения
            </NavLink>
          </nav>
        </header>
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
