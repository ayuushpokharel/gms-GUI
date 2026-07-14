import axios from "axios";
import {
  TODAY_CHECKIN_OPTIONS_REQUEST,
  TODAY_CHECKIN_OPTIONS_SUCCESS,
  TODAY_CHECKIN_OPTIONS_FAIL,
  CHECKIN_REQUEST,
  CHECKIN_SUCCESS,
  CHECKIN_FAIL,
  MY_ATTENDANCE_REQUEST,
  MY_ATTENDANCE_SUCCESS,
  MY_ATTENDANCE_FAIL,
  CLEAR_ERRORS,
} from "../constants/attendanceConstants";

// Get today's check-in options (enrolled classes scheduled for today)
export const getTodayCheckinOptions = () => async (dispatch) => {
  try {
    dispatch({ type: TODAY_CHECKIN_OPTIONS_REQUEST });

    const { data } = await axios.get("/api/v1/attendance/today");

    dispatch({
      type: TODAY_CHECKIN_OPTIONS_SUCCESS,
      payload: data.classes,
    });
  } catch (error) {
    dispatch({
      type: TODAY_CHECKIN_OPTIONS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Self check-in to a class
export const checkIn = (classId) => async (dispatch) => {
  try {
    dispatch({ type: CHECKIN_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axios.post(
      "/api/v1/attendance/checkin",
      { classId },
      config,
    );

    dispatch({ type: CHECKIN_SUCCESS, payload: data.attendance });
  } catch (error) {
    dispatch({
      type: CHECKIN_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get my attendance history + stats (streak, heatmap, class breakdown)
export const getMyAttendance = () => async (dispatch) => {
  try {
    dispatch({ type: MY_ATTENDANCE_REQUEST });

    const { data } = await axios.get("/api/v1/attendance/me");

    dispatch({
      type: MY_ATTENDANCE_SUCCESS,
      payload: { records: data.records, stats: data.stats },
    });
  } catch (error) {
    dispatch({
      type: MY_ATTENDANCE_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
