import React from "react";
import gearsLogo from "../../assets/gears.svg";
import { useReducer, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useSelector, useDispatch } from "react-redux";

import "/src/styles/Tasks.css";

import { addTask, deleteTask } from "../redux/slices/tasksSlice";

const Tasks = () => {
  const dispatch = useDispatch();

  const handleAddTask = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const title = formData.get("title");
    console.log(title);
    dispatch(
      addTask({
        id: uuidv4(),
        title: title.trim(),
        experience: 0,
        level: 1,
      })
    );
    event.target.reset(); // Очищаем форму после отправки
  };

  const tasks = useSelector((state) => state.tasks.tasks);
  // console.log(tasks);

  return (
    <div className="tasks tasks--flex-column tasks--gap ">
      {tasks.map((item) => {
        const progressBar = (item.experience / (item.level * 1000)) * 100;
        // const expTotal = item.level * 1000;
        const uniqueId = uuidv4();
        return (
          <div key={uuidv4()} className="flex-row flex-row--gap ">
            <div className="label-bar">{item.title}</div>
            <div
              id="exp-bar"
              className="experience-bar "
              style={{
                "--progress": `${progressBar}%`,
                "--borderRadius": `${progressBar >= 6 ? `inherit` : `100%`}`,
                "--scale": `${progressBar < 5 ? `.85` : "1"}`,
              }}
            >
              <span className="exp-bar__numb">
                {item.experience}/{item.level * 1000}{" "}
              </span>
            </div>
            <div className="experience-bar__lvl"> {item.level} </div>
            <button
              className="delete-button"
              onClick={() => dispatch(deleteTask(item.id))}
            ></button>
          </div>
        );
      })}

      <form onSubmit={handleAddTask} className="flex-column task__form">
        <input className="task__input" name="title"></input>
        <button className="task__button" type="submit">
          Добавить таск
        </button>
      </form>
    </div>
  );
};

export default Tasks;
