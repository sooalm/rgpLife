import React from "react";
import { useState, useEffect, useContext, useRef } from "react";
import { useDispatch } from "react-redux";
import "../../../styles/ProgressBar.css";
import { useSelector } from "react-redux";
// import { ImCheckmark2 } from "react-icons/im";
import { TimeContext } from "./TimeContextProvider";
import { updateTask } from "../../redux/slices/tasksSlice";

const ProgressBar = () => {
  const dispatch = useDispatch();
  const [time, setTime] = useState(25 * 60); //время в секундах, то что будет идти и меняться
  const [initiallTime, setInitiallTime] = useState(25 * 60); //время с которого начался отсчет

  const [percent, setPercent] = useState(0); //процент прогресса
  const { sharedDataTime, setSharedDataTime } = useContext(TimeContext); //время что назначенно инпутами

  const selectedRef = useRef(null);
  const [isSelectDisabled, setIsSelectDisabled] = useState(false); // Используем состояние

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

    const shouldDisable = secondsAll > 0 && secondsAll !== initiallSeconds;
    setIsSelectDisabled(shouldDisable);
    if (secondsAll <= 0) {
      console.log("finish");
      // setTime(`finish`);

      dispatch(
        updateTask({
          id: selectedRef.current,
          experience: (initiallSeconds / 60 / 25).toFixed(3) * 2500,
        })
      );
      setIsSelectDisabled(false); // Разблокируем при завершени

      setPercent(100);
      clearInterval(intervalId.current);
    } else {
      setPercent(100 - (secondsAll / initiallSeconds) * 100);

      secondsAll--;

      return secondsAll;
    }
  }
  function handleTime(secondsAll) {
    secondsAll = timeCount(initiallTime, secondsAll);
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
    setIsSelectDisabled(false);
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

  // useEffect(() => {
  //   if (tasks && tasks.length > 0) {
  //     handleSelectChange({ target: { value: tasks[0].id } });
  //   }
  // }, []);

  const tasks = useSelector((state) => state.tasks.tasks);

  const selectedTask = useRef(null);
  const options = useRef(null);

  function handleSelectChange(id) {
    const selectedId = id;
    console.log("selectedId", selectedId);
    if (!selectedId) return;
    // console.log("отработал селект",selectedId);
    selectedRef.current = selectedId;
  }

  const handleSelectClick = () => {
    options.current?.classList.toggle("select-hide");
  };

  const handleOptionClick = (e) => {
    if (e.target.getAttribute("data-value")) {
      selectedTask.current.textContent = e.target.textContent;
      // console.log("ssssssssssss", e.target);
      const id = e.target.getAttribute("data-value");
      selectedRef.current = id;

      // handleSelectChange();
      options.current?.classList.add("select-hide");
    }
  };

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
    </>
  );
};

export default ProgressBar;
