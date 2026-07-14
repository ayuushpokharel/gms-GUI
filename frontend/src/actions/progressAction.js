import axios from "axios";
import {
  ADD_PROGRESS_REQUEST,
  ADD_PROGRESS_SUCCESS,
  ADD_PROGRESS_FAIL,
  MY_PROGRESS_REQUEST,
  MY_PROGRESS_SUCCESS,
  MY_PROGRESS_FAIL,
  DELETE_PROGRESS_REQUEST,
  DELETE_PROGRESS_SUCCESS,
  DELETE_PROGRESS_FAIL,
  CLEAR_ERRORS,
} from "../constants/progressConstants";

// Add new progress entry
export const addProgress = (progressData) => async (dispatch) => {
  try {
    dispatch({ type: ADD_PROGRESS_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axios.post(
      "/api/v1/progress/new",
      progressData,
      config,
    );

    dispatch({ type: ADD_PROGRESS_SUCCESS, payload: data.progress });
  } catch (error) {
    dispatch({
      type: ADD_PROGRESS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get my progress entries
export const getMyProgress = () => async (dispatch) => {
  try {
    dispatch({ type: MY_PROGRESS_REQUEST });

    const { data } = await axios.get("/api/v1/progress/me");

    dispatch({ type: MY_PROGRESS_SUCCESS, payload: data.progressEntries });
  } catch (error) {
    dispatch({
      type: MY_PROGRESS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Delete a progress entry
export const deleteProgress = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_PROGRESS_REQUEST });

    await axios.delete(`/api/v1/progress/${id}`);

    dispatch({ type: DELETE_PROGRESS_SUCCESS });
  } catch (error) {
    dispatch({
      type: DELETE_PROGRESS_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
