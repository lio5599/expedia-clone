import axios from "axios";
import { API } from "../../baseurl";
import {
  HOTEL_FAILURE,
  HOTEL_REQUEST,
  GET_HOTEL_SUCCESS,
  POST_HOTEL_SUCCESS,
  NEW_GET_HOTELS_SUCCESS,
  DELETE_HOTEL,
} from "./actionType";

export const getHotelSuccess = (payload) => {
  return { type: GET_HOTEL_SUCCESS, payload };
};

export const postHotelSuccess = (payload) => {
  return { type: POST_HOTEL_SUCCESS };
};

export const hotelRequest = () => {
  return { type: HOTEL_REQUEST };
};

export const hotelFailure = () => {
  return { type: HOTEL_FAILURE };
};

export const fetch_hotel = (payload) => {
  return { type: NEW_GET_HOTELS_SUCCESS, payload };
};

//
export const handleDeleteHotel = (payload) => {
  return { type: DELETE_HOTEL, payload };
};

//

export const addHotel = (payload) => (dispatch) => {
  dispatch(hotelRequest());

  axios
    .post(`${API}/hotel`, payload) // https://makemytrip-api-data.onrender.com/hotel
    .then(() => {
      dispatch(postHotelSuccess());
    })
    .catch((err) => {
      dispatch(hotelFailure());
    });
};

export const fetchingHotels = (limit) => (dispatch) => {
  axios
    .get(`${API}/hotel?_limit=${limit}`) // https://makemytrip-api-data.onrender.com/hotel?_limit=${limit}
    .then((res) => {
      //   console.log(res.data);
      dispatch(fetch_hotel(res.data));
    })
    .catch((err) => {
      console.log(err);
    });
};

export const DeleteHotel = (deleteId) => async (dispatch) => {
  try {
    await axios.delete(`${API}/hotel/${deleteId}`); // https://makemytrip-api-data.onrender.com/hotel/${deleteId}
    dispatch(handleDeleteHotel(deleteId));
  } catch (e) {
    console.log(e);
  }
};
