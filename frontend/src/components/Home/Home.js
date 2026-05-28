import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";
import ClassCard from "./ClassCard";
import { getAllClasses, clearErrors } from "../../actions/classAction";
import Pagination from "react-js-pagination";
import "./Home.css";

const categories = [
  "Yoga", "Cardio", "Strength Training", "Zumba",
  "CrossFit", "Pilates", "Martial Arts",
];

const Home = () => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");

  const {
    loading,
    error,
    classes,
    classesCount,
    resultPerPage,
    filteredClassesCount,
  } = useSelector((state) => state.classes);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getAllClasses("", currentPage, [0, 100000], selectedCategory));
  }, [dispatch, error, alert, currentPage, selectedCategory]);

  const setCurrentPageNo = (e) => setCurrentPage(e);

  return (
    <>
      <MetaData title="GMS — Gym Management System" />

      {/* Hero Banner */}
      <div className="home-hero">
        <div className="hero-content">
          <h1>Transform Your Body.<br />Transform Your Life.</h1>
          <p>Join GMS and access world-class fitness classes led by expert trainers.</p>
          <a href="/classes" className="hero-cta">Explore Classes →</a>
        </div>
      </div>

      {/* Category Quick Filters */}
      <div className="home-categories">
        <button
          className={`cat-btn ${selectedCategory === "" ? "active" : ""}`}
          onClick={() => { setSelectedCategory(""); setCurrentPage(1); }}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`cat-btn ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Classes Grid */}
      <div className="home-section">
        <h2 className="section-title">
          {selectedCategory ? `${selectedCategory} Classes` : "Featured Classes"}
        </h2>

        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="classes-grid">
              {classes && classes.map((gymClass) => (
                <ClassCard key={gymClass._id} gymClass={gymClass} />
              ))}
            </div>

            {filteredClassesCount > resultPerPage && (
              <div className="pagination-box">
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={resultPerPage}
                  totalItemsCount={filteredClassesCount}
                  onChange={setCurrentPageNo}
                  nextPageText="Next"
                  prevPageText="Prev"
                  firstPageText="First"
                  lastPageText="Last"
                  itemClass="page-item"
                  linkClass="page-link"
                  activeClass="pageItemActive"
                  activeLinkClass="pageLinkActive"
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Why GMS Section */}
      <div className="why-gms">
        <h2>Why Choose GMS?</h2>
        <div className="why-grid">
          <div className="why-card">
            <span>🏆</span>
            <h3>Expert Trainers</h3>
            <p>Certified professionals with years of experience in their specializations.</p>
          </div>
          <div className="why-card">
            <span>📅</span>
            <h3>Flexible Schedules</h3>
            <p>Classes available mornings, evenings, and weekends to fit your lifestyle.</p>
          </div>
          <div className="why-card">
            <span>💪</span>
            <h3>All Fitness Levels</h3>
            <p>From beginners to advanced athletes — there's a class for everyone.</p>
          </div>
          <div className="why-card">
            <span>📊</span>
            <h3>BMI Tracking</h3>
            <p>Monitor your health metrics and track progress over time.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
