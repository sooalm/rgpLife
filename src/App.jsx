import { useState } from "react";
import gearsLogo from "./assets/gears.svg";

import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={gearsLogo} className="logo" alt="Vite logo" />
        </a>
      </div>
    </>
  );
}

export default App;
