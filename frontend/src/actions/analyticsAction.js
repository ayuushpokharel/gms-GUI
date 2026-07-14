import axios from "axios";
import {
  ANALYTICS_REQUEST,
  ANALYTICS_SUCCESS,
  ANALYTICS_FAIL,
  CLEAR_ERRORS,
} from "../constants/analyticsConstants";

export const getAnalytics = () => async (dispatch) => {
  try {
    dispatch({ type: ANALYTICS_REQUEST });
    const { data } = await axios.get("/api/v1/admin/analytics");
    dispatch({ type: ANALYTICS_SUCCESS, payload: data.analytics });
  } catch (error) {
    dispatch({
      type: ANALYTICS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
