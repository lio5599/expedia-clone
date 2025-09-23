import axios from "axios";
import { API } from "../../baseurl";
import * as types from "./actionType";

export const fetchCart = () => async (dispatch) => {
  dispatch({ type: types.GET_CART_REQUEST });
  try {
    const res = await axios.get(`${API}/cart`);
    dispatch({ type: types.GET_CART_SUCCESS, payload: res.data });
  } catch (err) {
    dispatch({ type: types.GET_CART_FAILURE, payload: err.message });
  }
};

export const addToCart = (item) => async (dispatch) => {
  dispatch({ type: types.ADD_TO_CART_REQUEST });
  try {
    // avoid sending an existing `id` from a product (flight/hotel) to the cart so json-server assigns a fresh id
    const payload = { ...item };
    if (payload.id !== undefined) delete payload.id;
    const res = await axios.post(`${API}/cart`, payload);
    dispatch({ type: types.ADD_TO_CART_SUCCESS, payload: res.data });
  } catch (err) {
    dispatch({ type: types.ADD_TO_CART_FAILURE, payload: err.message });
  }
};

export const removeFromCart = (id) => async (dispatch) => {
  dispatch({ type: types.REMOVE_FROM_CART_REQUEST });
  try {
    // try delete from main cart first
    try {
      await axios.delete(`${API}/cart/${id}`);
      dispatch({ type: types.REMOVE_FROM_CART_SUCCESS, payload: id });
      return;
    } catch (e) {
      // continue to fallback strategies
    }
    // fallback: try to find the item in /cart by matching various fields (id may be numeric or string)
    const cartRes = await axios.get(`${API}/cart`);
    const found = (cartRes.data || []).find((i) => `${i.id}` === `${id}` || `${i.airline}` === `${id}` || `${i.title}` === `${id}` || `${i.name}` === `${id}` || `${i.number}` === `${id}`);
    if (found) {
      await axios.delete(`${API}/cart/${found.id}`);
      dispatch({ type: types.REMOVE_FROM_CART_SUCCESS, payload: id });
      return;
    }
  } catch (err) {
    // fallback: maybe the item lives in legacy collections; try to find and delete it by matching fields
    try {
      // try flightcart
      const fRes = await axios.get(`${API}/flightcart`);
      const fItem = (fRes.data || []).find((i) => `${i.id}` === `${id}` || `${i.airline}` === `${id}` || `${i.number}` === `${id}`);
      if (fItem) {
        await axios.delete(`${API}/flightcart/${fItem.id}`);
        dispatch({ type: types.REMOVE_FROM_CART_SUCCESS, payload: id });
        return;
      }
    } catch (e) {
      // ignore
    }
    try {
      const hRes = await axios.get(`${API}/hotelcart`);
      const hItem = (hRes.data || []).find((i) => `${i.id}` === `${id}` || `${i.name}` === `${id}` || `${i.title}` === `${id}`);
      if (hItem) {
        await axios.delete(`${API}/hotelcart/${hItem.id}`);
        dispatch({ type: types.REMOVE_FROM_CART_SUCCESS, payload: id });
        return;
      }
    } catch (e) {
      // ignore
    }
    dispatch({ type: types.REMOVE_FROM_CART_FAILURE, payload: err.message });
  }
};

export const clearCart = () => async (dispatch) => {
  dispatch({ type: types.CLEAR_CART_REQUEST });
  try {
    //have to fetch items and delete one by one because json server won't let you delete in bulk
    const res = await axios.get(`${API}/cart`);
    const items = res.data || [];
    await Promise.all(items.map((i) => axios.delete(`${API}/cart/${i.id}`)));
    // also clear legacy collections if they exist to avoid stale items showing in other parts of the app
    try {
      const flightRes = await axios.get(`${API}/flightcart`);
      const flightItems = flightRes.data || [];
      await Promise.all(flightItems.map((f) => axios.delete(`${API}/flightcart/${f.id}`)));
    } catch (e) {
      // ignore if endpoint doesn't exist
    }
    try {
      const hotelRes = await axios.get(`${API}/hotelcart`);
      const hotelItems = hotelRes.data || [];
      await Promise.all(hotelItems.map((h) => axios.delete(`${API}/hotelcart/${h.id}`)));
    } catch (e) {
      // ignore if endpoint doesn't exist
    }
    dispatch({ type: types.CLEAR_CART_SUCCESS });
    return true;
  } catch (err) {
    dispatch({ type: types.CLEAR_CART_FAILURE, payload: err.message });
    throw err;
  }
};
