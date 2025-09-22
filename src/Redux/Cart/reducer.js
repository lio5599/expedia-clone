import * as types from "./actionType";

const initialState = {
  loading: false,
  data: [],
  error: null,
};

export const CartReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_CART_REQUEST:
    case types.ADD_TO_CART_REQUEST:
    case types.REMOVE_FROM_CART_REQUEST:
    case types.CLEAR_CART_REQUEST:
      return { ...state, loading: true };
    case types.GET_CART_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case types.ADD_TO_CART_SUCCESS:
      return { ...state, loading: false, data: [...state.data, action.payload] };
    case types.REMOVE_FROM_CART_SUCCESS:
      return { ...state, loading: false, data: state.data.filter((i) => `${i.id}` !== `${action.payload}`) };
    case types.CLEAR_CART_SUCCESS:
      return { ...state, loading: false, data: [] };
    case types.GET_CART_FAILURE:
    case types.ADD_TO_CART_FAILURE:
    case types.REMOVE_FROM_CART_FAILURE:
    case types.CLEAR_CART_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
