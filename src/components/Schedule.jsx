import React from "react";
import WeeklyAvailabilityForm from './WeeklyAvailabilityForm';

function Schedule() {
  return (
    <div>
      <div>
        <WeeklyAvailabilityForm teacher="Teacher1" />
        <WeeklyAvailabilityForm teacher="Teacher2" />
        {/* Add more teachers as needed */}
      </div>
    </div>
  );
}

export default Schedule;
