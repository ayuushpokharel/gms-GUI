import axios from "axios";
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
    CLASS_DETAILS_REQUEST,
    CLASS_DETAILS_SUCCESS,
    CLASS_DETAILS_FAIL,
    NEW_REVIEW_REQUEST,
    NEW_REVIEW_SUCCESS,
    NEW_REVIEW_FAIL,
    DELETE_CLASS_REQUEST,
    DELETE_CLASS_SUCCESS,
    DELETE_CLASS_FAIL,
    UPDATE_CLASS_REQUEST,
    UPDATE_CLASS_SUCCESS,
    UPDATE_CLASS_FAIL,
    ALL_REVIEW_REQUEST,
    ALL_REVIEW_SUCCESS,
    ALL_REVIEW_FAIL,
    DELETE_REVIEW_REQUEST,
    DELETE_REVIEW_SUCCESS,
    DELETE_REVIEW_FAIL,
    CLEAR_ERRORS,
} from "../constants/classConstants";

export const getAllClasses =
    (
        keyword = "",
        currentPage = 1,
        price = [0, 25000],
        category,
        ratings = 0,
    ) =>
    async (dispatch) => {
        try {
            dispatch({ type: ALL_CLASS_REQUEST });

            let link = `/api/v1/classes?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}`;

            if (category) {
                link = `${link}&category=${category}`;
            }

            const { data } = await axios.get(link);

            dispatch({
                type: ALL_CLASS_SUCCESS,
                payload: data,
            });
        } catch (error) {
            dispatch({
                type: ALL_CLASS_FAIL,
                payload: error.response?.data?.message || error.message,
            });
        }
    };

export const getAdminClasses = () => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_CLASS_REQUEST });
        const { data } = await axios.get("/api/v1/admin/classes");
        dispatch({ type: ADMIN_CLASS_SUCCESS, payload: data.classes });
    } catch (error) {
        dispatch({
            type: ADMIN_CLASS_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

export const getClassDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: CLASS_DETAILS_REQUEST });
        const { data } = await axios.get(`/api/v1/class/${id}`);
        dispatch({ type: CLASS_DETAILS_SUCCESS, payload: data.gymClass });
    } catch (error) {
        dispatch({
            type: CLASS_DETAILS_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

export const createClass = (classData) => async (dispatch) => {
    try {
        dispatch({ type: NEW_CLASS_REQUEST });
        const config = { headers: { "Content-Type": "application/json" } };
        const { data } = await axios.post(
            "/api/v1/admin/class/new",
            classData,
            config,
        );
        dispatch({ type: NEW_CLASS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: NEW_CLASS_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

export const updateClass = (id, classData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_CLASS_REQUEST });
        const config = { headers: { "Content-Type": "application/json" } };
        const { data } = await axios.put(
            `/api/v1/admin/class/${id}`,
            classData,
            config,
        );
        dispatch({ type: UPDATE_CLASS_SUCCESS, payload: data.success });
    } catch (error) {
        dispatch({
            type: UPDATE_CLASS_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

export const deleteClass = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_CLASS_REQUEST });
        const { data } = await axios.delete(`/api/v1/admin/class/${id}`);
        dispatch({ type: DELETE_CLASS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: DELETE_CLASS_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

export const newReview = (reviewData) => async (dispatch) => {
    try {
        dispatch({ type: NEW_REVIEW_REQUEST });
        const config = { headers: { "Content-Type": "application/json" } };
        const { data } = await axios.put("/api/v1/review", reviewData, config);
        dispatch({ type: NEW_REVIEW_SUCCESS, payload: data.success });
    } catch (error) {
        dispatch({
            type: NEW_REVIEW_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

export const getAllReviews = (id) => async (dispatch) => {
    try {
        dispatch({ type: ALL_REVIEW_REQUEST });
        const { data } = await axios.get(`/api/v1/reviews?id=${id}`);
        dispatch({ type: ALL_REVIEW_SUCCESS, payload: data.reviews });
    } catch (error) {
        dispatch({
            type: ALL_REVIEW_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

export const deleteReview = (reviewId, classId) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_REVIEW_REQUEST });
        const { data } = await axios.delete(
            `/api/v1/reviews?id=${reviewId}&classId=${classId}`,
        );
        dispatch({ type: DELETE_REVIEW_SUCCESS, payload: data.success });
    } catch (error) {
        dispatch({
            type: DELETE_REVIEW_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};
