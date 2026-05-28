import React from "react";
import MetaData from "../MetaData";
import "./About.css";

const About = () => {
  return (
    <>
      <MetaData title="About GMS" />
      <div className="about-container">
        <div className="about-hero">
          <h1>🏋️ About GMS</h1>
          <p>Gym Management System — Powering your fitness journey</p>
        </div>
        <div className="about-content">
          <div className="about-card">
            <h2>Who We Are</h2>
            <p>
              GMS (Gym Management System) is a modern, full-featured gym management
              platform built to connect trainees with world-class trainers and fitness
              classes. Whether you're a beginner or an advanced athlete, GMS has the
              tools and classes for you.
            </p>
          </div>
          <div className="about-card">
            <h2>Our Mission</h2>
            <p>
              We believe fitness should be accessible, trackable, and enjoyable.
              Our mission is to simplify gym management while empowering members
              with the data and support they need to reach their goals.
            </p>
          </div>
          <div className="about-card">
            <h2>What We Offer</h2>
            <ul>
              <li>🧘 Diverse classes: Yoga, Cardio, CrossFit, Zumba & more</li>
              <li>💪 Expert trainers with specialized skills</li>
              <li>📊 BMI tracking and fitness goal management</li>
              <li>💳 Flexible membership plans: Basic, Standard, Premium</li>
              <li>🔒 Secure online payments via Stripe</li>
            </ul>
          </div>
          <div className="about-stats">
            <div className="stat">
              <h3>500+</h3>
              <p>Active Members</p>
            </div>
            <div className="stat">
              <h3>50+</h3>
              <p>Classes Weekly</p>
            </div>
            <div className="stat">
              <h3>20+</h3>
              <p>Expert Trainers</p>
            </div>
            <div className="stat">
              <h3>5★</h3>
              <p>Average Rating</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
