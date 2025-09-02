import React from "react";
import { useState, useContext } from "react";

import { TimeContext } from "./TimeContextProvider";

import "../../../styles/StartProgress.css";
const StartProgress = () => {
  const { setSharedDataTime } = useContext(TimeContext);

  const [inputs, setInputs] = useState([0, 0, 0]);

  const handleChange = (index) => (event) => {
    const newInputs = [...inputs]; // Копируем текущие значения
    const value = event.target.value;
    // if (index == 0 && event.target.value > 9) {
    //   newInputs[index] = 8;
    // } else {
    //   newInputs[index] = event.target.value;
    // }
    if (/^\d{0,2}$/.test(value)) {
      newInputs[index] = value;
    }
    if (index == 0 && value > 9) {
      newInputs[index] = 9;
    }
    // Обновляем значение по индексу
    setInputs(newInputs); // Обновляем состояние
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSharedDataTime(inputs);
    // setInputs([0, 25, 0]);
  };
  return (
    <form onSubmit={handleSubmit} className="flex-column">
      <div className="">
        <label htmlFor="hours" className="pomodoro-container__label">
          Часы:
        </label>
        <input
          value={inputs[0]} // Значение первого инпута
          onChange={handleChange(0)} // Обработчик для первого инпута
          id="hours"
          type="number"
          className="pomodoro-container__input"
        />
        <br />
        <label htmlFor="minutes" className="pomodoro-container__label">
          Минуты:
        </label>

        <input
          value={inputs[1]}
          onChange={handleChange(1)}
          id="minutes"
          type="number"
          className="pomodoro-container__input"
        />
        <br />
        <label htmlFor="seconds" className="pomodoro-container__label">
          Секунды:
        </label>
        <input
          value={inputs[2]}
          onChange={handleChange(2)}
          id="seconds"
          type="number"
          className="pomodoro-container__input"
        />
      </div>
      <button className="submit-button" type="submit">
        Назначить время
      </button>
    </form>
  );
};

export default StartProgress;
