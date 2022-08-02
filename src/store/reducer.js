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

const initialState = {
  addToCartItems: [],
  cartItems: [],
  subTotal: 0,
  customerInfo: {},
  checkoutState: [],
};

function reducer(state, action) {
  switch (action.type) {
    case INCREASE_ITEM:
      return {
        ...state,
        todoItem: action.payload,
      };
    case QUERY_CART_ITEMS:
      return {
        ...state,
        cartItems: action.payload,
        subTotal: action.payload
          .map((item) => item.price * item.quantity)
          .reduce((prev, curr) => prev + curr),
        checkoutState: new Array(action.payload.length).fill(true),
      };
    case INCREMENT:
      const increase = state.cartItems.map((item, index) => {
        if (index === action.payload) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
      const subTotalAfterIncrease = increase
        .map((item) => item.price * item.quantity)
        .reduce((prev, curr) => prev + curr);
      return {
        ...state,
        cartItems: increase,
        subTotal: subTotalAfterIncrease,
      };
    case DECREMENT:
      const decrease = state.cartItems.map((item, index) => {
        if (index === action.payload) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      });
      const subTotalAfterDecrease = decrease
        .map((item) => item.price * item.quantity)
        .reduce((prev, curr) => prev + curr);
      return {
        ...state,
        cartItems: decrease,
        subTotal: subTotalAfterDecrease,
      };
    case REMOVE_ITEM:
      const index = state.cartItems.findIndex(
        (item, index) => index === action.payload
      );
      const modifyCartItems = [...state.cartItems]
        .slice(0, index)
        .concat([...state.cartItems].slice(index + 1));
      return {
        ...state,
        cartItems: modifyCartItems,
      };
    case ADD_TO_CHECKOUT:
      const updateCheckoutItems = state.checkoutState.map((item, index) => {
        return index === action.payload ? !item : item;
      });
      const subTotalAfterUpdate = state.cartItems
        .map((item, index) => {
          if (updateCheckoutItems[index]) {
            return item.price * item.quantity;
          }
          return 0;
        })
        .reduce((prev, curr) => prev + curr);
      return {
        ...state,
        checkoutState: updateCheckoutItems,
        subTotal: subTotalAfterUpdate,
      };
    case ADD_ALL_TO_CHECKOUT:
      const updateAllCheckoutItems =
        action.payload === true
          ? new Array(state.checkoutState.length).fill(true)
          : new Array(state.checkoutState.length).fill(false);
      const subTotalAfterUpdateAll = state.cartItems
        .map((item, index) => {
          if (updateAllCheckoutItems[index]) {
            return item.price * item.quantity;
          }
          return 0;
        })
        .reduce((prev, curr) => prev + curr);
      return {
        ...state,
        checkoutState: updateAllCheckoutItems,
        subTotal: subTotalAfterUpdateAll,
      };
    case ADD_TO_CART:
      const isExist = state.addToCartItems.find(
        (item) => item == action.payload
      );
      console.log('isExist', isExist);
      const modifyCart = isExist
        ? [...state.addToCartItems]
        : [...state.addToCartItems, action.payload];
      const finalCart = modifyCart.map((item, index) =>
        item == isExist
          ? { ...item, amount: item.amount + 1 }
          : { ...item, amount: 1 }
      );
      return {
        ...state,
        addToCartItems: finalCart,
      };
    case REDUCE_QUANTITY_IN_CART:
      const reduceList = state.addToCartItems.map((item, index) =>
        index === action.payload
          ? { ...item, amount: item.amount - 1 }
          : { ...item }
      );
      return {
        ...state,
        addToCartItems: reduceList,
      };
    case REMOVE_FROM_CART:
      const indexInCart = state.addToCartItems.findIndex(
        (item, index) => index === action.payload
      );
      const modify = [...state.addToCartItems]
        .slice(0, indexInCart)
        .concat([...state.addToCartItems].slice(indexInCart + 1));
      return {
        ...state,
        addToCartItems: modify,
      };
    default:
      throw new Error('Invalid action');
  }
}

export { initialState };
export default reducer;
