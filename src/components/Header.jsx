import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="header-container">
      <h1>
      Course Picker  
      </h1>
      <div className="links-container">
        <Link className="comment-link" to="/">Home</Link>
        <Link className="comment-link" to="/schedule">Schedule</Link>
        <Link className="comment-link" to="/comment">Comment</Link>
      </div>
    </header>
  );
}

export default Header;
