import { useState } from "react";
import gearsLogo from "./assets/gears.svg";
import Profile from "./Components/Profile.jsx";
import GraphCon from "./components/GraphCon.jsx";

import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="app-container">
        <Profile />
        <GraphCon />
        <h2>Under Construction</h2>
        <img src={gearsLogo} className="logo" alt="Under construction" />
      </div>
    </>
  );
}

export default App;
