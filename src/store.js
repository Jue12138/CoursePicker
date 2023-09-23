import { configureStore } from "@reduxjs/toolkit";
import scheduleReducer from "./scheduleSlice";

const store = configureStore({
  reducer: {
    schedule: scheduleReducer,
  },
});

export default store;
