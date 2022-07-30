import React, { useCallback, useReducer, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_CUSTOMER } from '../graphql/queries';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/hooks';
import { setCustomerid } from '../store/actions';

const Main = () => {
  const [state, dispatch] = useStore();
  const { customerId } = state;
  const [getCustomerDetail, { data, error, loading }] =
    useLazyQuery(GET_CUSTOMER);
  const navigate = useNavigate();
  const [customerInput, setCustomerInput] = useState('');

  const handleClick = (pathname) => {
    getCustomerDetail({
      variables: {
        customerId: customerId,
      },
    });
    navigate(`/${pathname}`, { replace: true });
    localStorage.setItem('customerId', customerId);
  };

  return (
    <div>
      <form>
        <label>CustomerId</label>
        <input
          className="border-2"
          onChange={(event) => {
            setCustomerInput(event.target.value);
            dispatch(setCustomerid(event.target.value));
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
          onClick={() => handleClick('customer')}
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
      {/* <Formik
        initialValues={{ id: '' }}
        validate={(values) => {
          const errors = {};
          if (!values.id) {
            errors.id = 'Please enter your CustomerId';
          }
          return errors;
        }}
        // onSubmit={(values, { setSubmitting }) => {
        //   getCustomerDetail({
        //     variables: {
        //       customerId: values.id,
        //     },
        //   });
        // }}
      >
        {({ isSubmitting }) => (
          <Form>
            <label>CustomerId</label>
            <Field type="text" name="id" className="border-2" />
            <ErrorMessage name="id" component="div" />
            <button
              type="button"
              disabled={isSubmitting}
              onClick={(isSubmitting) => handleClick('admin', isSubmitting)}
            >
              Admin
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={(isSubmitting) => handleClick('customer', isSubmitting)}
            >
              Customer
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={(isSubmitting) => handleClick('checkout', isSubmitting)}
            >
              Checkout
            </button>
          </Form>
        )}
      </Formik> */}
      {/* <Link to="/admin">Admin</Link>
      <Link to="/customer">Customer</Link>
      <Link to="/checkout">Checkout</Link> */}
    </div>
    // <div>Hello page</div>
  );
};

export default Main;
