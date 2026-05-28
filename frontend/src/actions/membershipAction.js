import axios from "axios";
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
    DELETE_MEMBERSHIP_REQUEST,
    DELETE_MEMBERSHIP_SUCCESS,
    DELETE_MEMBERSHIP_FAIL,
    CLEAR_ERRORS,
} from "../constants/membershipConstants";

export const createMembership = (membership) => async (dispatch) => {
    try {
        dispatch({ type: CREATE_MEMBERSHIP_REQUEST });
        const config = { headers: { "Content-Type": "application/json" } };
        const { data } = await axios.post(
            "/api/v1/membership/new",
            membership,
            config,
        );
        dispatch({ type: CREATE_MEMBERSHIP_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: CREATE_MEMBERSHIP_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

export const myMemberships = () => async (dispatch) => {
    try {
        dispatch({ type: MY_MEMBERSHIP_REQUEST });
        const { data } = await axios.get("/api/v1/memberships/me");
        dispatch({ type: MY_MEMBERSHIP_SUCCESS, payload: data.memberships });
    } catch (error) {
        dispatch({
            type: MY_MEMBERSHIP_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

export const getMembershipDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: MEMBERSHIP_DETAILS_REQUEST });
        const { data } = await axios.get(`/api/v1/membership/${id}`);
        dispatch({
            type: MEMBERSHIP_DETAILS_SUCCESS,
            payload: data.membership,
        });
    } catch (error) {
        dispatch({
            type: MEMBERSHIP_DETAILS_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

export const getAllMemberships = () => async (dispatch) => {
    try {
        dispatch({ type: ALL_MEMBERSHIPS_REQUEST });
        const { data } = await axios.get("/api/v1/admin/memberships");
        dispatch({ type: ALL_MEMBERSHIPS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: ALL_MEMBERSHIPS_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

export const updateMembership = (id, membershipData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_MEMBERSHIP_REQUEST });
        const config = { headers: { "Content-Type": "application/json" } };
        const { data } = await axios.put(
            `/api/v1/admin/membership/${id}`,
            membershipData,
            config,
        );
        dispatch({ type: UPDATE_MEMBERSHIP_SUCCESS, payload: data.success });
    } catch (error) {
        dispatch({
            type: UPDATE_MEMBERSHIP_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

export const deleteMembership = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_MEMBERSHIP_REQUEST });
        const { data } = await axios.delete(`/api/v1/admin/membership/${id}`);
        dispatch({ type: DELETE_MEMBERSHIP_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: DELETE_MEMBERSHIP_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};
