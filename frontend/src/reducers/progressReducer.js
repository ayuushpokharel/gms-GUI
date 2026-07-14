import {
  ADD_PROGRESS_REQUEST,
  ADD_PROGRESS_SUCCESS,
  ADD_PROGRESS_FAIL,
  ADD_PROGRESS_RESET,
  MY_PROGRESS_REQUEST,
  MY_PROGRESS_SUCCESS,
  MY_PROGRESS_FAIL,
  DELETE_PROGRESS_REQUEST,
  DELETE_PROGRESS_SUCCESS,
  DELETE_PROGRESS_FAIL,
  DELETE_PROGRESS_RESET,
  CLEAR_ERRORS,
} from "../constants/progressConstants";

export const myProgressReducer = (state = { progressEntries: [] }, action) => {
  switch (action.type) {
    case MY_PROGRESS_REQUEST:
      return { loading: true, progressEntries: [] };
    case MY_PROGRESS_SUCCESS:
      return { loading: false, progressEntries: action.payload };
    case MY_PROGRESS_FAIL:
      return { loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

export const addProgressReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_PROGRESS_REQUEST:
    case DELETE_PROGRESS_REQUEST:
      return { loading: true };
    case ADD_PROGRESS_SUCCESS:
      return { loading: false, success: true };
    case DELETE_PROGRESS_SUCCESS:
      return { loading: false, isDeleted: true };
    case ADD_PROGRESS_FAIL:
    case DELETE_PROGRESS_FAIL:
      return { loading: false, error: action.payload };
    case ADD_PROGRESS_RESET:
    case DELETE_PROGRESS_RESET:
      return {};
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};
