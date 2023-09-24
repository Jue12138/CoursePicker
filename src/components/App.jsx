import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Comment from "./Comment";
import Schedule from "./Schedule";

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<h1>Welcome</h1>} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/comment" element={<Comment />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
