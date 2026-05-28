import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import {
  classesReducer,
  classDetailReducer,
  newClassReducer,
  classReducer,
  newReviewReducer,
  classReviewsReducer,
  reviewReducer,
} from "./reducers/classReducer";

import {
  userReducer,
  ProfileReducer,
  forgotPasswordReducer,
  allUsersReducer,
  userDetailsReducer,
} from "./reducers/userReducer";

import { cartReducer } from "./reducers/cartReducer";

import {
  newMembershipReducer,
  myMembershipsReducer,
  MembershipDetailsReducer,
  allMembershipsReducer,
  membershipReducer,
} from "./reducers/membershipReducer";

const reducer = combineReducers({
  gymClass: classDetailReducer,
  classes: classesReducer,
  user: userReducer,
  profile: ProfileReducer,
  forgotPassword: forgotPasswordReducer,
  cart: cartReducer,
  membership: newMembershipReducer,
  myMemberships: myMembershipsReducer,
  membershipDetail: MembershipDetailsReducer,
  newReview: newReviewReducer,
  newClass: newClassReducer,
  classEdit: classReducer,
  allMemberships: allMembershipsReducer,
  membershipUpdate: membershipReducer,
  allUsers: allUsersReducer,
  userDetails: userDetailsReducer,
  classReviews: classReviewsReducer,
  review: reviewReducer,
});

let initialState = {
  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    shippingInfo: localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo"))
      : {},
  },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
