import React, { createContext, useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import { updateTask } from "../../redux/slices/tasksSlice";
// Создаем контекст
export const TimeContext = createContext(`wihtout provider`);

export const TimeContextProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [time, setTime] = useState(25 * 60); //время в секундах, то что будет идти и меняться
  const [initiallTime, setInitiallTime] = useState(25 * 60); //время с которого начался отсчет

  const [percent, setPercent] = useState(0); //процент прогресса
  // const { sharedDataTime, setSharedDataTime } = useContext(TimeContext);
  const [sharedDataTime, setSharedDataTime] = useState(false); //время что назначенно инпутами

  const selectedRef = useRef(null);
  const [isSelectDisabled, setIsSelectDisabled] = useState(false); // Используем состояние

  let intervalId = useRef(null);

  useEffect(() => {
    return () => clearInterval(intervalId.current); // Очистка интервала при размонтировании
  }, []);

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
    <TimeContext.Provider
      value={{
        time,
        percent,
        setSharedDataTime,
        isSelectDisabled,
        setIsSelectDisabled,
        handlePlayButton,
        handlePauseButton,
        handleResetButton,
        selectedTask,
        options,
        handleSelectClick,
        handleOptionClick,
      }}
    >
      {children}
    </TimeContext.Provider>
  );
};
