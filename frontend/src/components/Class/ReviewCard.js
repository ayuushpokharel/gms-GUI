import React from "react";
import ReactStars from "react-rating-stars-component";
import "./ReviewCard.css";

const ReviewCard = ({ review }) => {
  const options = {
    value: review.rating,
    readOnly: true,
    precision: 0.5,
    size: 16,
    activeColor: "#E63946",
  };

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="review-avatar">
          {review.name ? review.name.charAt(0).toUpperCase() : "U"}
        </div>
        <div>
          <p className="review-name">{review.name}</p>
          <ReactStars {...options} />
        </div>
      </div>
      <p className="review-comment">{review.comment}</p>
    </div>
  );
};

export default ReviewCard;
