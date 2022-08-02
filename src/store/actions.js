import {
  INCREASE_ITEM,
  QUERY_CART_ITEMS,
  INCREMENT,
  DECREMENT,
  REMOVE_ITEM,
  ADD_TO_CHECKOUT,
  ADD_ALL_TO_CHECKOUT,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  REDUCE_QUANTITY_IN_CART,
} from './constants';

export const addToCart = (payload) => ({
  type: ADD_TO_CART,
  payload,
});

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

export const removeFromCart = (payload) => ({
  type: REMOVE_FROM_CART,
  payload,
});

export const reduceQuantityInCart = (payload) => ({
  type: REDUCE_QUANTITY_IN_CART,
  payload,
});
