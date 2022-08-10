import React, { useRef } from 'react';
import { useStore } from '../../store/hooks';
import {
  addToCart,
  removeFromCart,
  reduceQuantityInCart,
} from '../../store/actions';
import { AiOutlinePlusSquare, AiOutlineMinusSquare } from 'react-icons/ai';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { UPDATE_CUSTOMER } from '../../graphql/mutations';

const Cart = ({ setIsShowCart, cart }) => {
  const [state, dispatch] = useStore();
  const cartRef = useRef();
  const [updateCart, { data, loading, error }] = useMutation(UPDATE_CUSTOMER);
  const total = (arr) => {
    return arr.reduce((cal, item) => {
      return cal + item.price * item.amount;
    }, 0);
  };
  const navigate = useNavigate();

  const DollarUsd = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const customerId = localStorage.getItem('customerId');

  const handleCloseCart = () => {
    cartRef.current.classList.remove('animate-fade-in');
    cartRef.current.classList.add('animate-fade-out');
    setTimeout(() => {
      setIsShowCart(false);
    }, 300);
  };

  const handleRemoveFromCart = (index) => {
    dispatch(removeFromCart(index));
  };

  const handleCheckout = async (cart) => {
    const cartUpdate = cart.map((item) => {
      return {
        productId: item.id,
        color: item.colors.name,
        size: item.sizes,
        quantity: item.amount,
      };
    });
    await updateCart({
      variables: {
        customer: {
          customerId: customerId,
          items: cartUpdate,
        },
      },
    });
    navigate('/checkout', { replace: true });
  };

  return (
    <div
      className="fixed inset-0 bg-[rgba(0,0,0,0.7)]"
      onClick={handleCloseCart}
    >
      <div
        ref={cartRef}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-[250px] h-full absolute right-0 overflow-y-scroll animate-fade-in "
      >
        <h1 className="bg-amber-50 py-2 text-center text-black">Cart</h1>
        <div className="flex flex-col items-center px-2 py-4">
          {cart.map((item, index) => (
            <div
              key={index}
              className="text-center border-b-[3px] w-full mb-2 flex flex-col items-center"
            >
              <img
                className="w-[100px] h-[100px]"
                src={item.pictures[0]}
                alt={item.name}
              />
              <p className="text-white font-bold w-6 h-6 rounded-full bg-blue-700">
                {item.amount}
              </p>
              <h3 className="text-[0.8rem]">{item.name}</h3>
              <div className="flex items-center my-2">
                <button
                  onClick={() =>
                    item.amount <= 1
                      ? dispatch(removeFromCart(index))
                      : dispatch(reduceQuantityInCart(index))
                  }
                >
                  <AiOutlineMinusSquare className="text-[30px] text-gray-500" />
                </button>
                <p className="text-red-600 mx-2">
                  {DollarUsd.format(item.price)}
                </p>
                <button onClick={() => dispatch(addToCart(item))}>
                  <AiOutlinePlusSquare className="text-[30px] text-gray-500" />
                </button>
              </div>
            </div>
          ))}
          {cart.length > 0 && <p>Total: {DollarUsd.format(total(cart))} </p>}
        </div>
        <div className="text-center">
          <button
            className="py-1 px-2 font-semibold rounded-md mt-3 bg-[#907c6e] text-white"
            onClick={() => handleCheckout(cart)}
          >
            Checkout{' '}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
