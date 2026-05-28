import React, { useState } from "react";
import MetaData from "../MetaData";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for reaching out! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <>
      <MetaData title="Contact GMS" />
      <div className="contact-container">
        <div className="contact-hero">
          <h1>📞 Contact Us</h1>
          <p>We'd love to hear from you</p>
        </div>
        <div className="contact-grid">
          <div className="contact-info">
            <h2>Get In Touch</h2>
            <div className="info-item">
              <span>📧</span>
              <div>
                <h4>Email</h4>
                <p>info@gms.com</p>
              </div>
            </div>
            <div className="info-item">
              <span>📞</span>
              <div>
                <h4>Phone</h4>
                <p>+977-9800000000</p>
              </div>
            </div>
            <div className="info-item">
              <span>📍</span>
              <div>
                <h4>Location</h4>
                <p>Thamel, Kathmandu, Nepal</p>
              </div>
            </div>
            <div className="info-item">
              <span>🕐</span>
              <div>
                <h4>Hours</h4>
                <p>Mon–Sun: 5:00 AM – 10:00 PM</p>
              </div>
            </div>
          </div>
          <div className="contact-form-box">
            <h2>Send a Message</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  rows="5"
                  required
                />
              </div>
              <button type="submit" className="contact-submit-btn">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
