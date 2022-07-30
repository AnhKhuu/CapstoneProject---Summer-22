import { INCREASE_COUNT, INCREASE_ITEM, SET_CUSTOMERID } from './constants';

const initialState = {
  totalItem: 0,
  customerId: '',
  count: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case INCREASE_ITEM:
      return {
        ...state,
        todoItem: action.payload,
      };
    case SET_CUSTOMERID:
      return {
        ...state,
        customerId: action.payload,
      };
    case INCREASE_COUNT:
      return {
        ...state,
        count: action.payload,
      };
    default:
      throw new Error('Invalid action');
  }
}

export { initialState };
export default reducer;
