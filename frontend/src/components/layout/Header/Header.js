import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Header.css";

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);

  return (
    <header className="gms-header">
      <div className="header-brand">
        <Link to="/">
          <span className="header-logo">🏋️</span>
          <span className="header-title">GMS</span>
        </Link>
      </div>
      <nav className="header-nav">
        <Link to="/">Home</Link>
        <Link to="/classes">Classes</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>
      <div className="header-actions">
        <Link to="/cart" className="cart-icon">
          🛒
          {cartItems.length > 0 && (
            <span className="cart-badge">{cartItems.length}</span>
          )}
        </Link>
        <Link to="/login" className="login-btn">Login</Link>
      </div>
    </header>
  );
};

export default Header;
