import {
  ALL_CLASS_REQUEST,
  ALL_CLASS_SUCCESS,
  ALL_CLASS_FAIL,
  ADMIN_CLASS_REQUEST,
  ADMIN_CLASS_SUCCESS,
  ADMIN_CLASS_FAIL,
  NEW_CLASS_REQUEST,
  NEW_CLASS_SUCCESS,
  NEW_CLASS_FAIL,
  NEW_CLASS_RESET,
  CLASS_DETAILS_REQUEST,
  CLASS_DETAILS_SUCCESS,
  CLASS_DETAILS_FAIL,
  NEW_REVIEW_REQUEST,
  NEW_REVIEW_SUCCESS,
  NEW_REVIEW_FAIL,
  NEW_REVIEW_RESET,
  DELETE_CLASS_REQUEST,
  DELETE_CLASS_SUCCESS,
  DELETE_CLASS_FAIL,
  DELETE_CLASS_RESET,
  UPDATE_CLASS_REQUEST,
  UPDATE_CLASS_SUCCESS,
  UPDATE_CLASS_FAIL,
  UPDATE_CLASS_RESET,
  ALL_REVIEW_REQUEST,
  ALL_REVIEW_SUCCESS,
  ALL_REVIEW_FAIL,
  DELETE_REVIEW_REQUEST,
  DELETE_REVIEW_SUCCESS,
  DELETE_REVIEW_FAIL,
  DELETE_REVIEW_RESET,
  CLEAR_ERRORS,
} from "../constants/classConstants";

export const classesReducer = (state = { classes: [] }, action) => {
  switch (action.type) {
    case ALL_CLASS_REQUEST:
    case ADMIN_CLASS_REQUEST:
      return { loading: true, classes: [] };
    case ALL_CLASS_SUCCESS:
      return {
        loading: false,
        classes: action.payload.classes,
        classesCount: action.payload.classesCount,
        resultPerPage: action.payload.resultPerPage,
        filteredClassesCount: action.payload.filteredClassesCount,
      };
    case ADMIN_CLASS_SUCCESS:
      return { loading: false, classes: action.payload };
    case ALL_CLASS_FAIL:
    case ADMIN_CLASS_FAIL:
      return { loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

export const classDetailReducer = (state = { gymClass: {} }, action) => {
  switch (action.type) {
    case CLASS_DETAILS_REQUEST:
      return { loading: true, ...state };
    case CLASS_DETAILS_SUCCESS:
      return { loading: false, gymClass: action.payload };
    case CLASS_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

export const newClassReducer = (state = { gymClass: {} }, action) => {
  switch (action.type) {
    case NEW_CLASS_REQUEST:
      return { loading: true };
    case NEW_CLASS_SUCCESS:
      return { loading: false, success: action.payload.success, gymClass: action.payload.gymClass };
    case NEW_CLASS_FAIL:
      return { loading: false, error: action.payload };
    case NEW_CLASS_RESET:
      return { ...state, success: false };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

export const classReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_CLASS_REQUEST:
    case UPDATE_CLASS_REQUEST:
      return { loading: true };
    case DELETE_CLASS_SUCCESS:
      return { loading: false, isDeleted: action.payload.success };
    case UPDATE_CLASS_SUCCESS:
      return { loading: false, isUpdated: action.payload };
    case DELETE_CLASS_FAIL:
    case UPDATE_CLASS_FAIL:
      return { loading: false, error: action.payload };
    case DELETE_CLASS_RESET:
      return { ...state, isDeleted: false };
    case UPDATE_CLASS_RESET:
      return { ...state, isUpdated: false };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

export const newReviewReducer = (state = {}, action) => {
  switch (action.type) {
    case NEW_REVIEW_REQUEST:
      return { loading: true };
    case NEW_REVIEW_SUCCESS:
      return { loading: false, success: action.payload };
    case NEW_REVIEW_FAIL:
      return { loading: false, error: action.payload };
    case NEW_REVIEW_RESET:
      return { ...state, success: false };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

export const classReviewsReducer = (state = { reviews: [] }, action) => {
  switch (action.type) {
    case ALL_REVIEW_REQUEST:
      return { loading: true, reviews: [] };
    case ALL_REVIEW_SUCCESS:
      return { loading: false, reviews: action.payload };
    case ALL_REVIEW_FAIL:
      return { loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

export const reviewReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_REVIEW_REQUEST:
      return { loading: true };
    case DELETE_REVIEW_SUCCESS:
      return { loading: false, isDeleted: action.payload };
    case DELETE_REVIEW_FAIL:
      return { loading: false, error: action.payload };
    case DELETE_REVIEW_RESET:
      return { ...state, isDeleted: false };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};
