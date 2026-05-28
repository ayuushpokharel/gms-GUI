import {
  CREATE_MEMBERSHIP_REQUEST,
  CREATE_MEMBERSHIP_SUCCESS,
  CREATE_MEMBERSHIP_FAIL,
  MY_MEMBERSHIP_REQUEST,
  MY_MEMBERSHIP_SUCCESS,
  MY_MEMBERSHIP_FAIL,
  MEMBERSHIP_DETAILS_REQUEST,
  MEMBERSHIP_DETAILS_SUCCESS,
  MEMBERSHIP_DETAILS_FAIL,
  ALL_MEMBERSHIPS_REQUEST,
  ALL_MEMBERSHIPS_SUCCESS,
  ALL_MEMBERSHIPS_FAIL,
  UPDATE_MEMBERSHIP_REQUEST,
  UPDATE_MEMBERSHIP_SUCCESS,
  UPDATE_MEMBERSHIP_FAIL,
  UPDATE_MEMBERSHIP_RESET,
  DELETE_MEMBERSHIP_REQUEST,
  DELETE_MEMBERSHIP_SUCCESS,
  DELETE_MEMBERSHIP_FAIL,
  DELETE_MEMBERSHIP_RESET,
  CLEAR_ERRORS,
} from "../constants/membershipConstants";

export const newMembershipReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_MEMBERSHIP_REQUEST:
      return { loading: true };
    case CREATE_MEMBERSHIP_SUCCESS:
      return { loading: false, membership: action.payload };
    case CREATE_MEMBERSHIP_FAIL:
      return { loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

export const myMembershipsReducer = (state = { memberships: [] }, action) => {
  switch (action.type) {
    case MY_MEMBERSHIP_REQUEST:
      return { loading: true };
    case MY_MEMBERSHIP_SUCCESS:
      return { loading: false, memberships: action.payload };
    case MY_MEMBERSHIP_FAIL:
      return { loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

export const MembershipDetailsReducer = (
  state = { membership: {} },
  action
) => {
  switch (action.type) {
    case MEMBERSHIP_DETAILS_REQUEST:
      return { loading: true };
    case MEMBERSHIP_DETAILS_SUCCESS:
      return { loading: false, membership: action.payload };
    case MEMBERSHIP_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

export const allMembershipsReducer = (
  state = { memberships: [] },
  action
) => {
  switch (action.type) {
    case ALL_MEMBERSHIPS_REQUEST:
      return { loading: true };
    case ALL_MEMBERSHIPS_SUCCESS:
      return {
        loading: false,
        memberships: action.payload.memberships,
        totalAmount: action.payload.totalAmount,
      };
    case ALL_MEMBERSHIPS_FAIL:
      return { loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

export const membershipReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_MEMBERSHIP_REQUEST:
    case DELETE_MEMBERSHIP_REQUEST:
      return { loading: true };
    case UPDATE_MEMBERSHIP_SUCCESS:
      return { loading: false, isUpdated: action.payload };
    case DELETE_MEMBERSHIP_SUCCESS:
      return { loading: false, isDeleted: action.payload.success };
    case UPDATE_MEMBERSHIP_FAIL:
    case DELETE_MEMBERSHIP_FAIL:
      return { loading: false, error: action.payload };
    case UPDATE_MEMBERSHIP_RESET:
      return { ...state, isUpdated: false };
    case DELETE_MEMBERSHIP_RESET:
      return { ...state, isDeleted: false };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};
