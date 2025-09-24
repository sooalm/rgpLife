import { createSlice } from "@reduxjs/toolkit";

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    generalExperience: 0,
  },
  reducers: {
    addTask(state, action) {
      state.tasks.push(action.payload);
      state.generalExperience += action.payload.experience;
    },
    deleteTask(state, action) {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload.id);
      state.generalExperience -= task.experience;
    },
    editTask(state, action) {
      const task = state.tasks.find((task) => task.id === action.payload.id);
      if (task) {
        task.title = action.payload.title ?? task.title;
      }
    },
    updateTask(state, action) {
      const task = state.tasks.find((task) => task.id === action.payload.id);
      if (task) {
        task.experience += action.payload.experience ?? 0;
        if (task.experience > task.level * 1000)
          task.level = Math.floor(task.experience / 1000) + 1;

        state.generalExperience += task.experience;
      }
    },
  },
});
export const { addTask, deleteTask, editTask, updateTask } = tasksSlice.actions;
export default tasksSlice.reducer;
// state.generalExperience = state.tasks.reduce(
//   (sum, task) => sum + task.experience,
//   0
// );
