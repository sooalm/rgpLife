import React from "react";
import { useContext } from "react";
import { useSelector } from "react-redux";
import "../../../styles/ProgressBar.css";

import { TimeContext } from "./TimeContextProvider";
import StartProgress from "./StartProgress";

const ProgressBar = () => {
  const {
    time,
    percent,
    setSharedDataTime,
    isSelectDisabled,
    handlePlayButton,
    handlePauseButton,
    handleResetButton,
    selectedTask,
    options,
    handleSelectClick,
    handleOptionClick,
  } = useContext(TimeContext);

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

  const tasks = useSelector((state) => state.tasks.tasks);
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
      <div className="custom-select" data-disabled={isSelectDisabled}>
        <div
          ref={selectedTask}
          onClick={handleSelectClick}
          className="select-selected"
        >
          Выберите опцию
        </div>
        <div
          ref={options}
          onClick={handleOptionClick}
          className="select-items select-hide"
        >
          {tasks && tasks.length > 0 ? (
            tasks.map((item, index) => (
              <div className="custom-option" data-value={item.id} key={item.id}>
                {item.title}
              </div>
            ))
          ) : (
            <div data-value="">Без задач</div>
          )}
        </div>
      </div>
      <StartProgress setSharedDataTime={setSharedDataTime} />
    </>
  );
};

export default ProgressBar;
