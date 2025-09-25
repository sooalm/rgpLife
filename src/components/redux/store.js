import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./slices/tasksSlice";
import { loadState,saveState } from "./localStorage-redux";

const preloadedState = loadState();console.log(preloadedState);
const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    
  },
   preloadedState: preloadedState,
});
store.subscribe(() => {
  saveState(store.getState());
});

export default store;
