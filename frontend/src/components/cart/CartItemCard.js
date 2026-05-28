import React from "react";
import { Link } from "react-router-dom";
import "./CartItemCard.css";

const CartItemCard = ({ item, deleteCartItems, increaseQty, decreaseQty }) => {
  return (
    <div className="cart-item-card">
      <div className="cart-item-info">
        <img src={item.image} alt={item.name} className="cart-item-img" />
        <div>
          <Link to={`/class/${item.gymClass}`} className="cart-item-name">{item.name}</Link>
          <button className="cart-item-remove" onClick={() => deleteCartItems(item.gymClass)}>
            Remove
          </button>
        </div>
      </div>

      <div className="cart-item-qty">
        <button onClick={() => decreaseQty(item.gymClass, item.quantity)}>−</button>
        <span>{item.quantity}</span>
        <button onClick={() => increaseQty(item.gymClass, item.quantity, item.capacity)}>+</button>
      </div>

      <div className="cart-item-price">
        Rs. {item.price?.toLocaleString()}
      </div>

      <div className="cart-item-subtotal">
        Rs. {(item.price * item.quantity).toLocaleString()}
      </div>
    </div>
  );
};

export default CartItemCard;
