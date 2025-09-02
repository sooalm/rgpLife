import React from "react";
import { useState, useEffect, useContext, useRef } from "react";
import "../../../styles/ProgressBar.css";

// import { ImCheckmark2 } from "react-icons/im";
import { TimeContext } from "./TimeContextProvider";

const ProgressBar = () => {
  const [time, setTime] = useState(25 * 60);
  const [initiallTime, setInitiallTime] = useState(25 * 60);

  const [percent, setPercent] = useState(0);
  const { sharedDataTime, setSharedDataTime } = useContext(TimeContext); //время что назначенно инпутами

  let intervalId = useRef(null);
  useEffect(() => {
    return () => clearInterval(intervalId.current); // Очистка интервала при размонтировании
  }, []);

  function timeStringConverter(time) {
    const hours = String(Math.floor(time / 3600));
    const minutes = String(Math.floor((time - hours * 3600) / 60)).padStart(
      2,
      "0"
    );

    const seconds = String(time - hours * 60 * 60 - minutes * 60).padStart(
      2,
      "0"
    );

    return hours == 0
      ? `${minutes}:${seconds}`
      : `${hours}:${minutes}:${seconds}`;
  }
  function timeCount(initiallSeconds, secondsAll) {
    console.log(`timeCount`);
    setTime(secondsAll);
    if (secondsAll <= 0) {
      console.log("finish");
      // setTime(`finish`);
      setPercent(100);
      clearInterval(intervalId.current);
    } else {
      setPercent(100 - (secondsAll / initiallSeconds) * 100);

      secondsAll--;

      return secondsAll;
    }
  }
  function handleTime(secondsAll) {
    // const initiallSeconds = secondsAll;
    intervalId.current = setInterval(() => {
      secondsAll = timeCount(initiallTime, secondsAll);
    }, 1000);
  }

  function handlePlayButton() {
    clearInterval(intervalId.current);
    handleTime(time);
  }
  function handlePauseButton() {
    clearInterval(intervalId.current);
  }

  function handleResetButton() {
    console.log(`reset`);
    clearInterval(intervalId.current);
    setPercent(0);
    setTime(25 * 60);
    setInitiallTime(25 * 60);
    setSharedDataTime(false);
  }

  useEffect(() => {
    // если данные в startProgress были назначены, активируется
    console.log("use effect");
    if (sharedDataTime) {
      console.log("true");
      clearInterval(intervalId.current);
      const [h, m, s] = sharedDataTime;
      const timeSeconds = +h * 3600 + +m * 60 + +s;
      setInitiallTime(timeSeconds);
      setTime(timeSeconds);
      setPercent(0);
      setSharedDataTime(false);
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
