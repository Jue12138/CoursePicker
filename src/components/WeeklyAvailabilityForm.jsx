import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { days, times } from "../constants";
import { bookSlot as bookSlotAction, updateSchedule } from "../scheduleSlice"; 

const defaultAvailability = days.reduce((acc, day) => {
  acc[day] = times.reduce((timeAcc, time) => {
    timeAcc[time] = "unavailable";
    return timeAcc;
  }, {});
  return acc;
}, {});

function WeeklyAvailabilityForm({ teacher }) {
  const dispatch = useDispatch();
  const availability = useSelector(
    (state) => state.schedule.availability[teacher] || {}
  );

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [studentName, setStudentName] = useState("");

  const handleSlotClick = (day, time) => {
    if (availability[day]?.[time] === null) {
      setSelectedSlot({ day, time });
    }
  };

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetch("http://localhost:3001/current-schedule");
        const fetchedData = await response.json();

        const parsedAvailability = days.reduce((acc, day) => {
          acc[day] = times.reduce((timeAcc, time) => {
            const slot = fetchedData.find(
              (slot) =>
                slot.teacher_name === teacher &&
                slot.day === day &&
                slot.time === time
            );

            timeAcc[time] = slot
              ? slot.student_name
              : defaultAvailability[day][time] || " ";
            return timeAcc;
          }, {});
          return acc;
        }, {});

        dispatch(updateSchedule({ [teacher]: parsedAvailability }));
      } catch (error) {
        console.error("Error fetching the schedule:", error);
      }
    };

    fetchSchedule();
  }, [dispatch, teacher]);

  const bookSlot = async () => {
    if (selectedSlot && studentName) {
      try {
        const response = await fetch("http://localhost:3001/book-slot", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            teacher: teacher,
            day: selectedSlot.day,
            time: selectedSlot.time,
            student: studentName,
          }),
        });

        const data = await response.json();

        if (data.success) {
          dispatch(
            bookSlotAction({
              day: selectedSlot.day,
              time: selectedSlot.time,
              student: studentName,
              teacher: teacher,
            })
          );
        } else {
          console.error("Failed to book the slot");
        }
      } catch (error) {
        console.error("There was an error:", error);
      }

      setSelectedSlot(null);
      setStudentName("");
    }
  };

  return (
    <div>
      <h2>Schedule for {teacher}</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Hours / Days</th>
            {days.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {times.map((time) => (
            <tr key={time}>
              <td>{time <= 12 ? time + " AM" : time - 12 + " PM"}</td>
              {days.map((day) => (
                <td key={day}>
                  <button
                    onClick={() => handleSlotClick(day, time)}
                    style={{
                      backgroundColor:
                        availability[day]?.[time] === null
                          ? "green"
                          : availability[day]?.[time] === "unavailable"
                          ? "gray"
                          : "blue",
                      width: "100%",
                      height: "100%",
                      border: "none",
                      color: "white",
                    }}
                  >
                    {
                      availability[day]?.[time] === null
                        ? "Available"
                        : availability[day]?.[time] === "unavailable"
                        ? "Unavailable"
                        : availability[day]?.[time] // displays the student's name
                    }
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {selectedSlot && (
        <div>
          Booking for {selectedSlot.day},{" "}
          {selectedSlot.time <= 12
            ? selectedSlot.time + " AM"
            : selectedSlot.time - 12 + " PM"}
          <input
            placeholder="Enter student name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
          />
          <button onClick={bookSlot}>Book Slot</button>
        </div>
      )}
    </div>
  );
}

export default WeeklyAvailabilityForm;
