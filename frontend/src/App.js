import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import WebFont from "webfontloader";
import "./App.css";

// Layout
import Header from "./components/layout/Header/Header";
import UserOptions from "./components/layout/Header/UserOptions";
import Footer from "./components/layout/Footer/Footer";
import NotFound from "./components/layout/NotFound/NotFound";
import About from "./components/layout/About/About";
import Contact from "./components/layout/Contact/Contact";

// Home
import Home from "./components/Home/Home";

// Class
import Classes from "./components/Class/Classes";
import ClassDetails from "./components/Class/ClassDetails";

// User
import LoginSignUp from "./components/User/LoginSignUp";
import Profile from "./components/User/Profile";
import UpdateProfile from "./components/User/UpdateProfile";
import UpdatePassword from "./components/User/UpdatePassword";
import ForgotPassword from "./components/User/ForgotPassword";
import ResetPassword from "./components/User/ResetPassword";

// Trainer
import TrainerPortal from "./components/Trainer/TrainerPortal";

// Cart & Checkout
import Cart from "./components/cart/Cart";
import HealthInfo from "./components/cart/HealthInfo";
import ConfirmMembership from "./components/cart/ConfirmMembership";
import Payment from "./components/cart/Payment";
import MembershipSuccess from "./components/cart/MembershipSuccess";

// Membership
import MyMemberships from "./components/Membership/MyMemberships";
import MembershipDetails from "./components/Membership/MembershipDetails";

// Admin
import Dashboard from "./components/Admin/Dashboard";
import ClassList from "./components/Admin/ClassList";
import NewClass from "./components/Admin/NewClass";
import UpdateClass from "./components/Admin/UpdateClass";
import MembershipList from "./components/Admin/MembershipList";
import ProcessMembership from "./components/Admin/ProcessMembership";
import UserList from "./components/Admin/UserList";
import UpdateUser from "./components/Admin/UpdateUser";
import ClassReviews from "./components/Admin/ClassReviews";

// Protected Route
import ProtectedRoute from "./components/Route/ProtectedRoute";

// User action
import { loadUser } from "./actions/userAction";

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");
    setStripeApiKey(data.stripeApiKey);
  }

  useEffect(() => {
    WebFont.load({ google: { families: ["Roboto:300,400,500,700,900"] } });
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      getStripeApiKey();
    }
  }, [isAuthenticated]);

  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/classes/:keyword" element={<Classes />} />
        <Route path="/class/:id" element={<ClassDetails />} />
        <Route path="/login" element={<LoginSignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/cart" element={<Cart />} />

        {/* Protected */}
        <Route path="/account" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/profile/update" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />
        <Route path="/password/update" element={<ProtectedRoute><UpdatePassword /></ProtectedRoute>} />
        <Route path="/health-info" element={<ProtectedRoute><HealthInfo /></ProtectedRoute>} />
        <Route path="/membership/confirm" element={<ProtectedRoute><ConfirmMembership /></ProtectedRoute>} />
        <Route path="/success" element={<ProtectedRoute><MembershipSuccess /></ProtectedRoute>} />
        <Route path="/memberships" element={<ProtectedRoute><MyMemberships /></ProtectedRoute>} />
        <Route path="/membership/:id" element={<ProtectedRoute><MembershipDetails /></ProtectedRoute>} />

        {/* Payment (Stripe) */}
        {stripeApiKey && (
          <Route
            path="/process/payment"
            element={
              <Elements stripe={loadStripe(stripeApiKey)}>
                <ProtectedRoute><Payment /></ProtectedRoute>
              </Elements>
            }
          />
        )}

        {/* Trainer Portal */}
        <Route path="/trainer/portal" element={<ProtectedRoute><TrainerPortal /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<ProtectedRoute isAdmin={true}><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/classes" element={<ProtectedRoute isAdmin={true}><ClassList /></ProtectedRoute>} />
        <Route path="/admin/class" element={<ProtectedRoute isAdmin={true}><NewClass /></ProtectedRoute>} />
        <Route path="/admin/class/:id" element={<ProtectedRoute isAdmin={true}><UpdateClass /></ProtectedRoute>} />
        <Route path="/admin/memberships" element={<ProtectedRoute isAdmin={true}><MembershipList /></ProtectedRoute>} />
        <Route path="/admin/membership/:id" element={<ProtectedRoute isAdmin={true}><ProcessMembership /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute isAdmin={true}><UserList /></ProtectedRoute>} />
        <Route path="/admin/user/:id" element={<ProtectedRoute isAdmin={true}><UpdateUser /></ProtectedRoute>} />
        <Route path="/admin/reviews" element={<ProtectedRoute isAdmin={true}><ClassReviews /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
