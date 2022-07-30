import { INCREASE_ITEM, SET_CUSTOMERID, INCREASE_COUNT } from './constants';

export const increaseItem = (payload) => ({
  type: INCREASE_ITEM,
  payload,
});

export const setCustomerid = (payload) => ({
  type: SET_CUSTOMERID,
  payload,
});

export const increaseCount = (payload) => ({
  type: INCREASE_COUNT,
  payload,
});
