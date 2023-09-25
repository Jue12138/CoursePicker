import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Comment from "./Comment";
import WeeklyAvailabilityForm from "./WeeklyAvailabilityForm";

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <div id="container">
              <h2 class="set-space">Welcome to 1-1 course picker system.</h2>
              <p class="set-space">
                Click available and enter your name to reserve a class time.
              </p>
              <p class="set-space">Click your name to cancel it.</p>
              <div class="set-space">
                <div id="center-forms">
                <div class="set-space"> <WeeklyAvailabilityForm teacher="Teacher1" /> </div>
                <div class="set-space"> <WeeklyAvailabilityForm teacher="Teacher2" /> </div>
                </div>
              </div>
              </div>
            </>
          }
        />
        <Route path="/comment" element={<Comment />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
