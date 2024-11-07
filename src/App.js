import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
// import PostProject from "./postProject"; // Assuming this is your PostProject component

// Fake Dashboard Component
const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>This is the Dashboard page</p>
    </div>
  );
};

// Fake PostProperty Component
const PostProperty = () => {
  return (
    <div>
      <h1>Post Property</h1>
      <p>This is the Post Property page</p>
    </div>
  );
};
const PostProject = () => {
  return (
    <div>
      <h1>Post Project</h1>
      <p>This is the Post Property page</p>
    </div>
  );
};

function App() {
  return (
    <Router>
      {/* Header with navigation links */}
      <header>
        <nav>
          <ul>
            <li>
              <Link to="/post-project">Post Project</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/post-property">Post Property</Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Routes for the pages */}
      <Routes>
        <Route path="/post-project" element={<PostProject />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/post-property" element={<PostProperty />} />
      </Routes>
    </Router>
  );
}

export default App;
