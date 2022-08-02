import {
  INCREASE_ITEM,
  QUERY_CART_ITEMS,
  INCREMENT,
  DECREMENT,
  REMOVE_ITEM,
  ADD_TO_CHECKOUT,
  ADD_ALL_TO_CHECKOUT,
} from './constants';

export const increaseItem = (payload) => ({
  type: INCREASE_ITEM,
  payload,
});

export const queryCartItems = (payload) => ({
  type: QUERY_CART_ITEMS,
  payload,
});

export const increment = (payload) => ({
  type: INCREMENT,
  payload,
});

export const decrement = (payload) => ({
  type: DECREMENT,
  payload,
});

export const removeItem = (payload) => ({
  type: REMOVE_ITEM,
  payload,
});

export const addToCheckout = (payload) => ({
  type: ADD_TO_CHECKOUT,
  payload,
});

export const addAllToCheckout = (payload) => ({
  type: ADD_ALL_TO_CHECKOUT,
  payload,
});
