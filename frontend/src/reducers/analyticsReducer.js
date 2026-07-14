import {
  ANALYTICS_REQUEST,
  ANALYTICS_SUCCESS,
  ANALYTICS_FAIL,
  CLEAR_ERRORS,
} from "../constants/analyticsConstants";

export const analyticsReducer = (state = { analytics: null }, action) => {
  switch (action.type) {
    case ANALYTICS_REQUEST:
      return { loading: true, analytics: null };
    case ANALYTICS_SUCCESS:
      return { loading: false, analytics: action.payload };
    case ANALYTICS_FAIL:
      return { loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};
