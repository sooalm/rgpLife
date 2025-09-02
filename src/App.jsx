import { Routes, Route } from "react-router-dom";

import "./App.css";

import HomePage from "./components/pages/HomePage.jsx";
import Layout from "./components/pages/Layout.jsx";

import Pomodoro from "./components/pages/Pomodoro/Pomodoro.jsx";
import Tasks from "./components/pages/Tasks.jsx";
import Achievements from "./components/pages/Achievements.jsx";
import Notfound from "./components/pages/Notfound.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/pomodoro" element={<Pomodoro />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/achievements" element={<Achievements />} />

          <Route path="*" element={<Notfound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
