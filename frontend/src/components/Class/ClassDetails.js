import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import ReactStars from "react-rating-stars-component";
import Carousel from "react-material-ui-carousel";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";
import ReviewCard from "./ReviewCard";
import {
  getClassDetails,
  newReview,
  clearErrors,
} from "../../actions/classAction";
import { addItemsToCart } from "../../actions/cartAction";
import { NEW_REVIEW_RESET } from "../../constants/classConstants";
import "./ClassDetails.css";

const ClassDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const alert = useAlert();

  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { gymClass, loading, error } = useSelector((state) => state.gymClass);
  const { success, error: reviewError } = useSelector(
    (state) => state.newReview,
  );
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (reviewError) {
      alert.error(reviewError);
      dispatch(clearErrors());
    }
    if (success) {
      alert.success("Review submitted successfully!");
      dispatch({ type: NEW_REVIEW_RESET });
    }
    dispatch(getClassDetails(id));
  }, [dispatch, id, error, alert, reviewError, success]);

  const increaseQty = () => {
    if (gymClass.capacity <= quantity) return;
    setQuantity((q) => q + 1);
  };

  const decreaseQty = () => {
    if (quantity <= 1) return;
    setQuantity((q) => q - 1);
  };

  const addToCartHandler = () => {
    dispatch(addItemsToCart(id, quantity));
    alert.success("Class added to cart!");
  };

  const reviewSubmitHandler = () => {
    dispatch(newReview({ rating, comment, classId: id }));
    setOpen(false);
    setComment("");
    setRating(0);
  };

  const options = {
    value: gymClass?.ratings || 0,
    readOnly: true,
    precision: 0.5,
    size: 20,
    activeColor: "#E63946",
  };

  if (loading) return <Loader />;

  return (
    <>
      <MetaData title={`${gymClass?.name} — GMS`} />
      <div className="class-details">
        {/* Image Carousel */}
        <div className="class-details-left">
          <Carousel>
            {gymClass?.images?.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt={`class-${i}`}
                className="details-carousel-img"
              />
            ))}
          </Carousel>
        </div>

        {/* Info Panel */}
        <div className="class-details-right">
          <h1>{gymClass?.name}</h1>
          <span className="details-id">Class #{gymClass?._id}</span>

          <div className="details-rating">
            <ReactStars {...options} />
            <span>({gymClass?.numofReviews} reviews)</span>
          </div>

          <div className="details-price">
            Rs. {gymClass?.price?.toLocaleString()}
            <small>/month</small>
          </div>

          {/* Quantity + Cart */}
          <div className="details-qty-row">
            <div className="qty-controls">
              <button onClick={decreaseQty}>−</button>
              <input type="number" value={quantity} readOnly />
              <button onClick={increaseQty}>+</button>
            </div>
            <button
              className="add-cart-btn"
              disabled={gymClass?.capacity < 1}
              onClick={addToCartHandler}
            >
              {gymClass?.capacity < 1 ? "Full" : "Add to Cart"}
            </button>
          </div>
          <p className="capacity-info">
            Slots Available: <strong>{gymClass?.capacity}</strong>
          </p>

          {/* Schedule */}
          <div className="details-section">
            <h3>📅 Schedule</h3>
            <div className="schedule-grid">
              <div>
                <span>Day</span>
                <strong>{gymClass?.schedule?.day}</strong>
              </div>
              <div>
                <span>Time</span>
                <strong>{gymClass?.schedule?.time}</strong>
              </div>
              <div>
                <span>Duration</span>
                <strong>{gymClass?.schedule?.duration} min</strong>
              </div>
            </div>
          </div>

          {/* Membership */}
          <div className="details-section">
            <h3>💳 Required Membership</h3>
            <span
              className={`req-badge ${gymClass?.requiredMembership?.toLowerCase()}`}
            >
              {gymClass?.requiredMembership}
            </span>
          </div>

          {/* Trainer */}
          {gymClass?.trainer && (
            <div className="details-section trainer-info">
              <h3>🏅 Trainer</h3>
              <div className="trainer-row">
                <img
                  src={gymClass.trainer.avatar?.url || "/placeholder.jpg"}
                  alt="trainer"
                  className="trainer-avatar"
                />
                <div>
                  <strong>{gymClass.trainer.name}</strong>
                  <p>{gymClass.trainer.specialization}</p>
                  {gymClass.trainer.experience && (
                    <p>{gymClass.trainer.experience} yrs experience</p>
                  )}
                </div>
              </div>
              {gymClass.trainer.bio && (
                <p className="trainer-bio">{gymClass.trainer.bio}</p>
              )}
            </div>
          )}

          {/* Description */}
          <div className="details-section">
            <h3>📝 Description</h3>
            <p>{gymClass?.description}</p>
          </div>

          {/* Category */}
          <div className="details-meta">
            <span>
              Category: <strong>{gymClass?.category}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="reviews-section">
        <h2>Member Reviews</h2>

        {gymClass?.reviews && gymClass.reviews.length > 0 ? (
          <div className="reviews-grid">
            {gymClass.reviews.map((rev) => (
              <ReviewCard key={rev._id} review={rev} />
            ))}
          </div>
        ) : (
          <p className="no-reviews">No reviews yet. Be the first to review!</p>
        )}

        {/* Submit Review */}
        {isAuthenticated && (
          <div className="submit-review">
            <button className="review-open-btn" onClick={() => setOpen(!open)}>
              {open ? "Cancel" : "✏️ Write a Review"}
            </button>
            {open && (
              <div className="review-form">
                <div className="review-stars">
                  <ReactStars
                    count={5}
                    onChange={(val) => setRating(val)}
                    size={30}
                    activeColor="#E63946"
                  />
                </div>
                <textarea
                  placeholder="Share your experience with this class..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows="4"
                />
                <button
                  onClick={reviewSubmitHandler}
                  className="review-submit-btn"
                >
                  Submit Review
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ClassDetails;
