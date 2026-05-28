import React from "react";
import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import { useDispatch } from "react-redux";
import { addItemsToCart } from "../../actions/cartAction";
import { useAlert } from "react-alert";
import "./ClassCard.css";

const ClassCard = ({ gymClass }) => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const options = {
    value: gymClass.ratings,
    readOnly: true,
    precision: 0.5,
    size: 18,
    activeColor: "#E63946",
  };

  const addToCartHandler = (e) => {
    e.preventDefault();
    dispatch(addItemsToCart(gymClass._id, 1));
    alert.success("Class added to cart!");
  };

  return (
    <div className="class-card">
      <Link to={`/class/${gymClass._id}`} className="class-card-link">
        <div className="class-card-img-wrap">
          <img
            src={
              gymClass.images && gymClass.images[0]
                ? gymClass.images[0].url
                : "/placeholder.jpg"
            }
            alt={gymClass.name}
            className="class-card-img"
          />
          <span className="class-card-category">{gymClass.category}</span>
          {gymClass.capacity <= 5 && (
            <span className="class-card-low">⚠ Low Slots</span>
          )}
        </div>
        <div className="class-card-body">
          <h3 className="class-card-name">{gymClass.name}</h3>
          <div className="class-card-rating">
            <ReactStars {...options} />
            <span className="review-count">
              ({gymClass.numofReviews} reviews)
            </span>
          </div>
          <div className="class-card-schedule">
            📅 {gymClass.schedule?.day} &nbsp;|&nbsp; 🕐{" "}
            {gymClass.schedule?.time}
          </div>
          <div className="class-card-footer">
            <span className="class-card-price">
              Rs. {gymClass.price?.toLocaleString()}
              <small>/month</small>
            </span>
            <span
              className={`membership-badge ${gymClass.requiredMembership?.toLowerCase()}`}
            >
              {gymClass.requiredMembership}
            </span>
          </div>
        </div>
      </Link>
      <button className="add-to-cart-btn" onClick={addToCartHandler}>
        + Add to Cart
      </button>
    </div>
  );
};

export default ClassCard;
