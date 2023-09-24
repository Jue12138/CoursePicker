import { createSlice } from "@reduxjs/toolkit";
import { days, times } from "./constants"; 

const generateAvailability = (availableHours) => {
  return times.reduce((acc, time) => {
    acc[time] = availableHours.includes(time) ? null : "unavailable";
    return acc;
  }, {});
};

const generateDefaultAvailability = () => {
  return days.reduce((acc, day) => {
    acc[day] = times.reduce((timeAcc, time) => {
      timeAcc[time] = "unavailable";
      return timeAcc;
    }, {});
    return acc;
  }, {});
};

export const scheduleSlice = createSlice({
  name: "schedule",
  initialState: {
    events: [],
    availability: {
      Teacher1: {
        Monday: generateAvailability([10, 11]),
        Tuesday: generateAvailability([14, 15]),
        Wednesday: generateAvailability([]),
        Thursday: generateAvailability([]),
        Friday: generateAvailability([15, 16]),
      },
      Teacher2: {
        Monday: generateAvailability([]),
        Tuesday: generateAvailability([]),
        Wednesday: generateAvailability([13, 14, 15, 16]),
        Thursday: generateAvailability([10, 11, 12, 13, 14, 15]),
        Friday: generateAvailability([]),
      },
    },
  },
  reducers: {
    addEvent: (state, action) => {
      state.events.push(action.payload);
    },
    bookSlot: (state, action) => {
      const { day, time, student, teacher } = action.payload;
      if (!state.availability[teacher][day])
        state.availability[teacher][day] = {};
      state.availability[teacher][day][time] = student;
    },
    updateSchedule: (state, action) => {
      for (const teacher in action.payload) {
        const updatedSlots = { ...generateDefaultAvailability(), ...action.payload[teacher] };
        state.availability[teacher] = updatedSlots;
      }
    }
    ,
  },
});

export const { addEvent, bookSlot, updateSchedule } = scheduleSlice.actions;
export default scheduleSlice.reducer;
