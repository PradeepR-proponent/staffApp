import axios from 'axios'
import {
    GET_SERVICES_FAIL,
    GET_SERVICES_REQUEST,
    GET_SERVICES_SUCCESS,
    GET_SLOT_FAIL, GET_SLOT_REQUEST, GET_SLOT_SUCCESS,
    GET_CLIENTS_FAIL, GET_CLIENTS_REQUEST, GET_CLIENTS_SUCCESS,
    GET_STAFF_REQUEST, GET_STAFF_SUCCESS, GET_STAFF_FAIL,
    GET_UNAVAILABLETY_FAIL, GET_UNAVAILABLETY_REQUEST, GET_UNAVAILABLETY_SUCCESS


} from './actionTypes'

import { baseURL } from '../constants'


export const getSlots = (userToken, date, duration, Id) => async (dispatch) => {
    try {
        dispatch({ type: GET_SLOT_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        }

        let url;
        if (Id) {
            url = `${baseURL}/staff/appointment/available?date=${date}&duration=${duration}&staffId=${Id}`
        } else url = `${baseURL}/staff/appointment/available?date=${date}&duration=${duration}`

        const { data } = await axios.get(url, config)
        dispatch({ type: GET_SLOT_SUCCESS, payload: data })
    } catch (error) {
        dispatch({ type: GET_SLOT_FAIL, payload: error.response.data })
    }
}

export const getServices = (userToken, staffId) => async (dispatch) => {
    try {
        dispatch({ type: GET_SERVICES_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        }
        const { data } = await axios.get(`${baseURL}/staff/appointment/service?staffId=${staffId}`, config)
        dispatch({ type: GET_SERVICES_SUCCESS, payload: data.data })
    } catch (error) {
        dispatch({ type: GET_SERVICES_FAIL, payload: error.response.data })

    }
}

export const getClients = (userToken, phone) => async (dispatch) => {
    try {
        dispatch({ type: GET_CLIENTS_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        }
        const { data } = await axios.get(`${baseURL}/staff/client?id=&phone=${phone}`, config)
        dispatch({ type: GET_CLIENTS_SUCCESS, payload: data.data })
    } catch (error) {
        dispatch({ type: GET_CLIENTS_FAIL, payload: error.response.data })

    }
}

export const getStaffs = (userToken, date) => async (dispatch) => {
    try {
        dispatch({ type: GET_STAFF_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        }
        const { data } = await axios.get(`${baseURL}/staff/appointment/staff?date=${date}`, config)
        dispatch({ type: GET_STAFF_SUCCESS, payload: data.staff })
    } catch (error) {
        dispatch({ type: GET_STAFF_FAIL, payload: error.response.data })

    }
}

export const getUnavailability = (userToken) => async (dispatch) => {
    try {
        dispatch({ type: GET_UNAVAILABLETY_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        }
        const { data } = await axios.get(`${baseURL}/staff/holiday`, config)
        dispatch({ type: GET_UNAVAILABLETY_SUCCESS, payload: data?.data?.holidays })
    } catch (error) {
        dispatch({ type: GET_UNAVAILABLETY_FAIL, payload: error.response.data })

    }
}