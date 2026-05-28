import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useAlert } from "react-alert";
import Slider from "@mui/material/Slider";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";
import ClassCard from "../Home/ClassCard";
import { getAllClasses, clearErrors } from "../../actions/classAction";
import Pagination from "react-js-pagination";
import "./Classes.css";

const categories = [
  "Yoga", "Cardio", "Strength Training", "Zumba",
  "CrossFit", "Pilates", "Martial Arts", "Other",
];

const Classes = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { keyword } = useParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 10000]);
  const [category, setCategory] = useState("");
  const [ratings, setRatings] = useState(0);

  const {
    loading, error, classes, classesCount, resultPerPage, filteredClassesCount,
  } = useSelector((state) => state.classes);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getAllClasses(keyword, currentPage, price, category, ratings));
  }, [dispatch, keyword, currentPage, price, category, ratings, error, alert]);

  const priceHandler = (e, newPrice) => {
    setPrice(newPrice);
    setCurrentPage(1);
  };

  return (
    <>
      <MetaData title="All Classes — GMS" />
      <div className="classes-page">
        {/* Sidebar Filters */}
        <div className="filter-sidebar">
          <h3>Filters</h3>

          <div className="filter-section">
            <h4>Price Range (Rs.)</h4>
            <Slider
              value={price}
              onChange={priceHandler}
              valueLabelDisplay="auto"
              min={0}
              max={10000}
              step={100}
              sx={{ color: "#E63946" }}
            />
            <div className="price-labels">
              <span>Rs. {price[0]}</span>
              <span>Rs. {price[1]}</span>
            </div>
          </div>

          <div className="filter-section">
            <h4>Category</h4>
            <ul className="category-list">
              {categories.map((cat) => (
                <li
                  key={cat}
                  className={category === cat ? "active" : ""}
                  onClick={() => { setCategory(cat); setCurrentPage(1); }}
                >
                  {cat}
                </li>
              ))}
              {category && (
                <li className="clear-cat" onClick={() => setCategory("")}>✕ Clear</li>
              )}
            </ul>
          </div>

          <div className="filter-section">
            <h4>Minimum Rating</h4>
            <Slider
              value={ratings}
              onChange={(e, val) => { setRatings(val); setCurrentPage(1); }}
              valueLabelDisplay="auto"
              min={0}
              max={5}
              step={0.5}
              sx={{ color: "#E63946" }}
            />
            <span className="rating-label">⭐ {ratings}+</span>
          </div>
        </div>

        {/* Classes Grid */}
        <div className="classes-main">
          <div className="classes-header">
            <h2>
              {keyword ? `Results for "${keyword}"` : category ? category : "All Classes"}
            </h2>
            <span className="results-count">
              {filteredClassesCount} class{filteredClassesCount !== 1 ? "es" : ""} found
            </span>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <>
              <div className="classes-grid">
                {classes && classes.length > 0 ? (
                  classes.map((gymClass) => (
                    <ClassCard key={gymClass._id} gymClass={gymClass} />
                  ))
                ) : (
                  <div className="no-classes">
                    <p>😔 No classes found. Try adjusting filters.</p>
                  </div>
                )}
              </div>

              {filteredClassesCount > resultPerPage && (
                <div className="pagination-box">
                  <Pagination
                    activePage={currentPage}
                    itemsCountPerPage={resultPerPage}
                    totalItemsCount={filteredClassesCount}
                    onChange={(e) => setCurrentPage(e)}
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
      </div>
    </>
  );
};

export default Classes;
