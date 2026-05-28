import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="gms-footer">
      <div className="footer-left">
        <h2>🏋️ GMS</h2>
        <p>Gym Management System — Your fitness journey starts here.</p>
      </div>
      <div className="footer-links">
        <h4>Quick Links</h4>
        <Link to="/">Home</Link>
        <Link to="/classes">Classes</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </div>
      <div className="footer-right">
        <h4>Contact</h4>
        <p>📧 info@gms.com</p>
        <p>📞 +977-9800000000</p>
        <p>📍 Kathmandu, Nepal</p>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} GMS — Gym Management System. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
