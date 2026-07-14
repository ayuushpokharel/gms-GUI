import {
  TODAY_CHECKIN_OPTIONS_REQUEST,
  TODAY_CHECKIN_OPTIONS_SUCCESS,
  TODAY_CHECKIN_OPTIONS_FAIL,
  CHECKIN_REQUEST,
  CHECKIN_SUCCESS,
  CHECKIN_FAIL,
  CHECKIN_RESET,
  MY_ATTENDANCE_REQUEST,
  MY_ATTENDANCE_SUCCESS,
  MY_ATTENDANCE_FAIL,
  CLEAR_ERRORS,
} from "../constants/attendanceConstants";

export const todayCheckinOptionsReducer = (state = { classes: [] }, action) => {
  switch (action.type) {
    case TODAY_CHECKIN_OPTIONS_REQUEST:
      return { loading: true, classes: [] };
    case TODAY_CHECKIN_OPTIONS_SUCCESS:
      return { loading: false, classes: action.payload };
    case TODAY_CHECKIN_OPTIONS_FAIL:
      return { loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

export const checkInReducer = (state = {}, action) => {
  switch (action.type) {
    case CHECKIN_REQUEST:
      return { loading: true };
    case CHECKIN_SUCCESS:
      return { loading: false, success: true };
    case CHECKIN_FAIL:
      return { loading: false, error: action.payload };
    case CHECKIN_RESET:
      return {};
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

export const myAttendanceReducer = (
  state = { records: [], stats: null },
  action,
) => {
  switch (action.type) {
    case MY_ATTENDANCE_REQUEST:
      return { loading: true, records: [], stats: null };
    case MY_ATTENDANCE_SUCCESS:
      return {
        loading: false,
        records: action.payload.records,
        stats: action.payload.stats,
      };
    case MY_ATTENDANCE_FAIL:
      return { loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};
