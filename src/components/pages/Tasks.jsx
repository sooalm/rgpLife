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
        id: uuidv4(), //пока оставляю, но думаю по итогу придется использовать удаление и редактуру по имени
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
    <div className="tasks flex-column">
      {tasks.map((item) => {
        // const expTotal = item.level * 1000;
        const uniqueId = uuidv4();
        return (
          <div key={uuidv4()} className="flex-row flex-row--gap ">
            <div  className="label-bar">
              {item.title}
            </div>
            <div id="exp-bar" className="experience-bar ">
              {item.experience}/{item.level * 1000}
            </div>
            <div className="experience-bar__lvl"> {item.level} </div>
          </div>
        );
      })}

      <form onSubmit={handleAddTask} className="flex-column task__form">
        <input name="title"></input>
        <button type="submit">Добавить таск</button>
      </form>
    </div>
  );
};

export default Tasks;
