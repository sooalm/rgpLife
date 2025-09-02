import React from "react";
import { useState, useEffect, useContext, useRef } from "react";
import "../../../styles/ProgressBar.css";

// import { ImCheckmark2 } from "react-icons/im";
import { TimeContext } from "./TimeContextProvider";

const ProgressBar = () => {
  const [time, setTime] = useState(`25:00`);
  const [percent, setPercent] = useState(0);
  const { sharedDataTime, setSharedDataTime } = useContext(TimeContext); //время что назначенно инпутами

  let intervalId = useRef(null);
  useEffect(() => {
    return () => clearInterval(intervalId.current); // Очистка интервала при размонтировании
  }, []);

  function timeStringConverter() {}
  function timeCount(initiallSeconds, secondsAll) {
    console.log(`timeCount`);

    if (secondsAll == 0) {
      console.log("finish");
      setTime(`finish`);
      setPercent(100);
      clearInterval(intervalId.current);
    }
    const hours = String(Math.floor(secondsAll / 3600));
    const minutes = String(
      Math.floor((secondsAll - hours * 3600) / 60)
    ).padStart(2, "0");

    const seconds = String(
      secondsAll - hours * 60 * 60 - minutes * 60
    ).padStart(2, "0");

    hours == 0
      ? setTime(`${minutes}:${seconds}`)
      : setTime(`${hours}:${minutes}:${seconds}`);

    setPercent(100 - (secondsAll / initiallSeconds) * 100);

    secondsAll--;
    return secondsAll;
  }
  function handleTime(secondsAll) {
    const initiallSeconds = secondsAll;
    intervalId.current = setInterval(() => {
      secondsAll = timeCount(initiallSeconds, secondsAll);
    }, 1000);
  }

  function handlePlayButton() {
    clearInterval(intervalId.current);

    if (sharedDataTime) {
      console.log(`play if`);
      const [h, m, s] = sharedDataTime;
      const timeSeconds = +h * 3600 + +m * 60 + +s;
      handleTime(timeSeconds);
      setSharedDataTime(false);
    } else {
      handleTime(5);
      console.log(`play else`);
    }
  }
  function handlePauseButton() {
    clearInterval(intervalId.current);
  }

  function handleResetButton() {
    console.log(`reset`);
    clearInterval(intervalId.current);
    setPercent(0);
    setTime(`25:00`);
    setSharedDataTime(false);
  }

  useEffect(() => {
    // если данные в startProgress были назначены, активируется
    if (sharedDataTime) {
      const [h, m, s] = sharedDataTime;
      const timeSeconds = +h * 3600 + +m * 60 + +s;
      // handleResetButton();
      const formattedM = String(m).padStart(2, "0");
      const formattedS = String(s).padStart(2, "0");
      h == 0
        ? setTime(`${formattedM}:${formattedS}`)
        : setTime(`${h}:${formattedM}:${formattedS}`);
    }
  }, [sharedDataTime]);

  return (
    <>
      <div
        className="progressbar"
        role="progressbar"
        aria-valuenow={timeStringConverter(time)}
        aria-live="polite"
        style={{ "--percent": `${percent}%` }}
      >
        <span>
          This <em>really awesome feature</em> requires JS
        </span>
      </div>

      <div className="flex-row flex-row flex-row--mtb-1r">
        <button
          onClick={handlePlayButton}
          className="pomodoro-container__startButton"
        ></button>
        <button
          onClick={handlePauseButton}
          className="pomodoro-container__startButton pomodoro-container__startButton--pause"
        ></button>
        <button
          onClick={handleResetButton}
          className="pomodoro-container__startButton pomodoro-container__startButton--reset"
        ></button>
      </div>
    </>
  );
};

export default ProgressBar;
