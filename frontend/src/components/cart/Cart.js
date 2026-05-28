import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeItemsFromCart, addItemsToCart } from "../../actions/cartAction";
import MetaData from "../layout/MetaData";
import CartItemCard from "./CartItemCard";
import "./Cart.css";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);

  const increaseQty = (id, quantity, capacity) => {
    if (quantity >= capacity) return;
    dispatch(addItemsToCart(id, quantity + 1));
  };

  const decreaseQty = (id, quantity) => {
    if (quantity <= 1) return;
    dispatch(addItemsToCart(id, quantity - 1));
  };

  const deleteCartItems = (id) => {
    dispatch(removeItemsFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/health-info");
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <MetaData title="Cart — GMS" />
      <div className="cart-page">
        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <h2>🛒 Your cart is empty</h2>
            <p>Add gym classes to your cart to get started.</p>
            <Link to="/classes" className="browse-classes-btn">Browse Classes</Link>
          </div>
        ) : (
          <>
            <div className="cart-container">
              <div className="cart-items-section">
                <h2>🛒 Your Cart ({cartItems.length} item{cartItems.length !== 1 ? "s" : ""})</h2>
                <div className="cart-header-row">
                  <span>Class</span>
                  <span>Sessions/Week</span>
                  <span>Price</span>
                  <span>Subtotal</span>
                </div>
                {cartItems.map((item) => (
                  <CartItemCard
                    key={item.gymClass}
                    item={item}
                    deleteCartItems={deleteCartItems}
                    increaseQty={increaseQty}
                    decreaseQty={decreaseQty}
                  />
                ))}
              </div>

              <div className="cart-summary">
                <h3>Order Summary</h3>
                <div className="summary-row">
                  <span>Subtotal ({cartItems.length} class{cartItems.length !== 1 ? "es" : ""})</span>
                  <strong>Rs. {subtotal.toLocaleString()}</strong>
                </div>
                <div className="summary-row muted">
                  <span>Facility Fee (18%)</span>
                  <strong>Rs. {Math.round(subtotal * 0.18).toLocaleString()}</strong>
                </div>
                <div className="summary-row muted">
                  <span>Processing Fee</span>
                  <strong>{subtotal > 2000 ? "Free" : "Rs. 200"}</strong>
                </div>
                <div className="summary-total">
                  <span>Total</span>
                  <strong>
                    Rs. {(
                      subtotal +
                      Math.round(subtotal * 0.18) +
                      (subtotal > 2000 ? 0 : 200)
                    ).toLocaleString()}
                  </strong>
                </div>
                <button className="checkout-btn" onClick={checkoutHandler}>
                  Proceed to Checkout →
                </button>
                <Link to="/classes" className="continue-shopping">← Continue Browsing</Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
