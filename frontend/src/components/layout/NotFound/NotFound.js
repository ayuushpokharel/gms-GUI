import React from "react";
import { Link } from "react-router-dom";
import MetaData from "../MetaData";
import "./NotFound.css";

const NotFound = () => {
  return (
    <>
      <MetaData title="Page Not Found" />
      <div className="not-found">
        <h1>404</h1>
        <p>Oops! Page not found.</p>
        <span>The page you're looking for doesn't exist in GMS.</span>
        <Link to="/" className="go-home-btn">
          🏠 Go to Home
        </Link>
      </div>
    </>
  );
};

export default NotFound;
