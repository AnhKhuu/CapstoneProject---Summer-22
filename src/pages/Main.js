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
    <div>
      <form>
        <label>CustomerId</label>
        <input
          className="border-2"
          onChange={(event) => {
            setCustomerInput(event.target.value);
          }}
        />
        <button
          type="button"
          disabled={customerInput === ''}
          onClick={() => handleClick('admin')}
        >
          Admin
        </button>
        <button
          type="button"
          disabled={customerInput === ''}
          onClick={() => handleClick('shoplist')}
        >
          Customer
        </button>
        <button
          type="button"
          disabled={customerInput === ''}
          onClick={() => handleClick('checkout')}
        >
          Checkout
        </button>
      </form>
    </div>
  );
};

export default Main;
