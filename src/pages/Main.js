import React, { useCallback, useReducer, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_CUSTOMER } from '../graphql/queries';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/hooks';

const Main = () => {
  const [getCustomerDetail, { data, error, loading }] =
    useLazyQuery(GET_CUSTOMER);
  const navigate = useNavigate();
  const [customerInput, setCustomerInput] = useState('');

  const handleClick = (pathname) => {
    getCustomerDetail({
      variables: {
        customerId: customerInput,
      },
    });
    navigate(`/${pathname}`, { replace: true });
    localStorage.setItem('customerId', customerInput);
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full flex-col bg-[#fcf4ef]">
      <h1 className="text-2xl mb-4">Welcome to Summer&apos;22</h1>
      <img src="/images/logoImg.png" className="h-28 mb-4"></img>
      <form className="flex flex-col justify-center items-center w-80">
        <div className="flex mb-5 items-center">
          <label className="block text-gray-700 text-base font-bold mr-3">
            CustomerId:{' '}
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={(event) => {
              setCustomerInput(event.target.value);
            }}
          />
        </div>
        <div className="flex justify-between w-full">
          <button
            className={`py-1 px-2 bg-[#907c6e] font-semibold rounded-md text-white ${
              customerInput !== '' && 'hover:bg-[#ae9a8c]'
            }`}
            type="button"
            disabled={customerInput === ''}
            onClick={() => handleClick('admin')}
          >
            Admin
          </button>
          <button
            className={`py-1 px-2 bg-[#907c6e] font-semibold rounded-md text-white ${
              customerInput !== '' && 'hover:bg-[#ae9a8c]'
            }`}
            type="button"
            disabled={customerInput === ''}
            onClick={() => handleClick('shoplist')}
          >
            Customer
          </button>
          <button
            className={`py-1 px-2 bg-[#907c6e] font-semibold rounded-md text-white ${
              customerInput !== '' && 'hover:bg-[#ae9a8c]'
            }`}
            type="button"
            disabled={customerInput === ''}
            onClick={() => handleClick('checkout')}
          >
            Checkout
          </button>
        </div>
      </form>
    </div>
  );
};

export default Main;
