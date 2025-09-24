import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./slices/tasksSlice";
// import bookSlice from "./slices/bookSlice";
// import filterReducer from "./slices/filterSlice";

const store = configureStore({
  reducer: {
    tasks: tasksReducer,
  },
});
export default store;
