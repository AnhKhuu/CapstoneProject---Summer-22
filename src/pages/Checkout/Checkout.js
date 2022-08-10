import React, { useEffect, useState, useCallback, useRef } from 'react';
import MainLayout from '../../layout/MainLayout';
import { GET_PRODUCT, GET_FEE, GET_CUSTOMER } from '../../graphql/queries';
import {
  UPDATE_CUSTOMER,
  EMPTY_CART,
  UPDATE_PRODUCT,
} from '../../graphql/mutations';
import { useStore, useDebounce } from '../../store/hooks';
import { useLazyQuery, useMutation } from '@apollo/client';
import { queryCartItems, addAllToCheckout } from '../../store/actions';
import Item from '../../component/checkout/Item';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import ConfirmModal from '../../component/checkout/ConfirmModal';

const Checkout = () => {
  const [getCustomer, resultCustomer] = useLazyQuery(GET_CUSTOMER);
  const [getProduct, resultProduct] = useLazyQuery(GET_PRODUCT);
  const [getFee, resultFee] = useLazyQuery(GET_FEE);

  const [updateCustomer, resultUpdateCustomer] = useMutation(UPDATE_CUSTOMER);
  const [updateProduct, resultUpdateProduct] = useMutation(UPDATE_PRODUCT);
  const [emptyCart, resultEmptyCart] = useMutation(EMPTY_CART);

  const [fee, setFee] = useState({ shipping: 0, tax: 0 });
  const [location, setLocation] = useState('');
  const [name, setName] = useState('');
  const [isShowModal, setIsShowModal] = useState(false);

  const rawCombineList = useRef(null);
  const rawCustomerDetail = useRef(null);

  const [state, dispatch] = useStore();
  const { cartItems, subTotal, checkoutState } = state;

  const debounced = useDebounce(location, 500);

  const customerId = localStorage.getItem('customerId');

  const navigate = useNavigate();

  const submitting = subTotal == 0 || !location || resultFee.loading || !name;

  useEffect(() => {
    const getInitialData = async () => {
      try {
        const { data } = await getCustomer({
          variables: {
            customerId: customerId,
          },
          fetchPolicy: 'no-cache',
        });
        rawCustomerDetail.current = {
          name: data?.customer.name,
          location: data?.customer.location,
        };
        setName(data?.customer.name);
        setLocation(data?.customer.location);

        const productId = data?.customer.items.map((item) => {
          return item.productId;
        });
        let productDetail = [];
        if (productId) {
          for (const item of productId) {
            const detail = await getProduct({
              variables: {
                productId: item,
              },
              fetchPolicy: 'no-cache',
            });
            productDetail.push(detail?.data);
          }
        }

        const combineCustomerProduct = productDetail?.map((item, index) => {
          return {
            ...item.product,
            quantity: data?.customer.items[index].quantity,
            color: data?.customer.items[index].color,
            size: data?.customer.items[index].size,
          };
        });

        const groupByList = [
          ...combineCustomerProduct
            .reduce((prev, curr) => {
              const key = curr.id + '-' + curr.color + '-' + curr.size;

              const item =
                prev.get(key) ||
                Object.assign({}, curr, {
                  quantity: 0,
                });

              item.quantity += curr.quantity;

              return prev.set(key, item);
            }, new Map())
            .values(),
        ];

        if (groupByList.length > 0) {
          dispatch(queryCartItems(groupByList));
          rawCombineList.current = groupByList;
        }

        if (data?.customer.location) {
          const fee = await getFee({
            variables: {
              location: data?.customer.location,
            },
          });
          setFee(fee.data.fee);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getInitialData();
  }, []);

  useEffect(() => {
    const getFeeData = async () => {
      if (debounced !== undefined) {
        if (debounced.trim() === '') {
          setFee({ shipping: 0, tax: 0 });
          return;
        }
        const feeData = await getFee({
          variables: {
            location: debounced,
          },
        });
        setFee(feeData?.data.fee);
      }
    };
    getFeeData();
  }, [debounced]);

  const handleSubmit = useCallback(async (name, location) => {
    try {
      await updateCustomer({
        variables: {
          customer: {
            customerId: customerId,
            name: name,
            location: location,
          },
        },
      });
      await cartItems.map((item, index) => {
        if (checkoutState[index]) {
          return updateProduct({
            variables: {
              product: {
                id: item.id,
                stock: item.stock - item.quantity,
              },
            },
          });
        }
      });
      await emptyCart({
        variables: {
          customerId: customerId,
        },
      });
      let listNoCheckoutItems = [];

      cartItems.map((item, index) => {
        if (checkoutState[index]) {
          return;
        } else {
          listNoCheckoutItems.push(item);
          return;
        }
      });

      let data = listNoCheckoutItems.map((item) => {
        return {
          productId: item.id,
          color: item.color,
          size: item.size,
          quantity: item.quantity,
        };
      });

      await updateCustomer({
        variables: {
          customer: {
            customerId: customerId,
            items: data,
          },
        },
      });
      navigate('/congratulations', { replace: true });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const compareChange = useCallback(
    (arr1, arr2, name, location) => {
      if (arr1 === null) {
        navigate('/', { replace: true });
        return;
      }
      let compare = [];
      if (arr1?.length > 0) {
        if (arr1?.length !== arr2?.length) {
          setIsShowModal(true);
          return;
        }
        compare = arr1?.map((item, index) => {
          return (
            Object.keys(item).length === Object.keys(arr2[index]).length &&
            Object.keys(item).every((p) => item[p] === arr2[index][p])
          );
        });
        let result = compare.every((item) => item === true);
        if (
          !result ||
          rawCustomerDetail.current.name !== name ||
          rawCustomerDetail.current.location !== location
        ) {
          setIsShowModal(true);
        } else {
          navigate('/', { replace: true });
        }
      }
    },
    [isShowModal]
  );

  const handleSave = useCallback(async (name, location) => {
    try {
      const updateCartItems = cartItems.map((item) => {
        return {
          productId: item.id,
          color: item.color,
          size: item.size,
          quantity: item.quantity,
        };
      });
      await updateCustomer({
        variables: {
          customer: {
            customerId: customerId,
            name: name,
            location: location,
            items: updateCartItems,
          },
        },
      });
      navigate('/', { replace: true });
    } catch (error) {
      console.log(error);
    }
  });

  const handleCancel = useCallback(() => {
    setIsShowModal(false);
    navigate('/', { replace: true });
  }, [isShowModal]);

  const handleBeforeUnload = (e) => {
    e.preventDefault();
    const message =
      'Are you sure you want to leave? All provided data will be lost.';
    e.returnValue = message;
    return message;
  };

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <>
      <MainLayout>
        <div className="my-10">
          <button
            className="rounded-md mb-3 hover:text-[#907c6e] font-semibold text-xl"
            onClick={() =>
              compareChange(rawCombineList.current, cartItems, name, location)
            }
          >
            &larr; Back
          </button>
          <h1 className="font-bold text-3xl mb-3">Shopping Cart</h1>
          <div className="flex justify-between items-start">
            {cartItems.length > 0 ? (
              <div className="w-[70%] mr-5">
                <div className="border-2 rounded-md mt-3">
                  <div className="w-full flex items-center border-b-2">
                    <p className="w-[15%] text-center font-semibold my-3">
                      Choose
                    </p>
                    <p className="w-1/2 text-center font-semibold my-3">
                      Products
                    </p>
                    <p className="w-[15%] text-center font-semibold my-3">
                      Quantity
                    </p>
                    <p className="w-[20%] text-center font-semibold my-3">
                      Total
                    </p>
                  </div>
                  <div className="w-full">
                    <div className="w-[15%] text-center">
                      <input
                        className="cursor-pointer"
                        type="checkbox"
                        onChange={(event) => {
                          dispatch(addAllToCheckout(event.target.checked));
                        }}
                        checked={checkoutState.every((item) => item === true)}
                      />
                    </div>
                  </div>
                  {cartItems?.map((item, index) => {
                    return (
                      <Item
                        key={index}
                        index={index}
                        item={item}
                        checkoutState={checkoutState}
                      />
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="mt-3 flex flex-col justify-center items-center w-full">
                <p className="text-gray-500 mb-3">
                  You have no items in your cart
                </p>
                <svg
                  className="w-52"
                  viewBox="0 0 597.6 623.23"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M297.69 34.24c1.48.15 2.76.77 3.93 1.6 1.36.96 2.65 2.01 3.93 3.08 2.15 1.78 4.04 3.78 5.25 6.34 1.34 2.83 2.37 5.72 2.07 8.94-.1 1.04.04 2.1-.07 3.13-.49 4.76-3.06 7.97-7.45 9.76-1.19.49-2.37 1.02-3.58 1.45-1.39.49-2.79.95-4.22 1.32-2.8.74-5.61 1.49-8.44 2.08-2.92.61-5.87 1.08-8.81 1.56-4.33.71-8.67 1.4-13.02 2.05-3.82.57-7.66 1.03-11.47 1.63-3.5.55-6.98 1.27-10.47 1.85-2.68.44-5.38.75-8.07 1.14-1.96.28-3.94.53-5.88.89-3.62.68-7.25 1.33-10.83 2.18-2.85.68-5.62 1.68-8.45 2.45-1.68.46-3.4.77-5.11 1.13-5.6 1.16-11.2 2.29-16.79 3.47-4.12.87-8.2 1.9-12.33 2.71-7.92 1.55-15.86 3-23.79 4.48-8.4 1.57-16.81 3.08-25.19 4.73-4.5.88-8.95 1.99-13.43 2.99-4.7 1.05-9.42 2.06-14.11 3.16-5.84 1.38-11.65 2.87-17.49 4.26-4.92 1.17-9.86 2.27-14.79 3.39-.31.07-.65.03-.97.05.23-.3.44-.63.7-.9 2.37-2.57 3.26-5.73 3.18-9.09-.1-4.49-.88-8.88-2.94-12.97-1.65-3.27-3.67-6.25-6.57-8.55-1.47-1.17-3.13-2.09-4.95-2.46-2.04-.41-4.16-.7-6.21.14-.16.07-.38-.01-.57-.02 1.65-1.26 3.62-1.71 5.59-2 4.1-.59 8.07-1.69 12.06-2.73 2.56-.67 5.16-1.17 7.78-1.57 9.2-1.39 18.38-2.9 27.45-5.06 5.56-1.33 11.18-2.45 16.79-3.56 7.78-1.54 15.57-3.03 23.38-4.45 7.34-1.33 14.7-2.52 22.04-3.82 5.49-.97 10.94-2.16 16.45-3 5.74-.88 11.25-2.7 16.94-3.78 5.99-1.14 11.96-2.39 17.93-3.64 4.54-.95 9.06-1.97 13.59-2.94 9.29-1.98 18.58-4 27.89-5.87 5.18-1.04 10.4-1.92 15.63-2.68 6.59-.96 22.56-2.95 23.42-2.87z"
                    fill="#f9d173"
                  ></path>
                  <path
                    d="M505.09 178.3c-.14-2.19-.52-4.37.19-6.61.35-1.11.05-2.49.46-3.72.05-.15-.11-.35-.13-.54-.24-1.76-1.5-2.59-2.99-3.08-3.65-1.2-189.8-71.81-194.99-74.02-1.17-.5-2.21-.56-3.42-.23-8.46 2.36-16.92 4.71-25.4 6.98-7.89 2.12-15.8 4.16-23.72 6.21-4.66 1.2-9.32 2.41-14.01 3.49-3.9.9-7.86 1.58-11.78 2.41-4.43.94-8.84 1.99-13.27 2.92-4.62.98-9.26 1.85-13.88 2.82-4.71.99-9.4 2.06-14.1 3.07-5.68 1.22-11.37 2.41-17.06 3.62-3.92.84-7.85 1.67-11.77 2.52-5.72 1.24-11.45 2.49-17.17 3.74-4.05.89-8.09 1.79-12.13 2.71-2.18.5-4.36.98-6.51 1.59-2.24.64-2.95 2.23-2.13 4.38.06.16.12.32.2.56-.53.15-1.05.3-1.57.45 3.74 1.04 7.24 2.67 9.86 4.93.88.76 1.79 1.47 2.72 2.13 5.96 2.55 12.29 4.13 18.57 5.78 5.76 1.52 11.12 3.35 16.32 5.65 1.26-.02 2.51.05 3.77.2 9.35 1.13 176.24 104.76 184.94 107.99 4.12-2.77 98.01-51.44 99.18-51.19 1.04.21 9.86-33.31 11.77-32.7 2.09.67 4.18 1.32 6.26 2.03 2.52.86 5.06 1.67 7.52 2.67 1.76.72 3.44 1.58 5.39 1.57.28 0 .56.12.83.2 1.71.51 3.4 1.07 5.12 1.54 2.39.65 3.95-.62 4.7-2.04.21-.4.3-.87.52-1.54 1.26 1.71 2.67 1.32 3.88.58 1.63.78 3.1 1.48 4.77 2.28-.35-3.29-.75-6.31-.94-9.35zM50.72 82.2c.19.01.41.08.57.02 2.05-.85 4.17-.55 6.21-.14 1.82.36 3.48 1.29 4.95 2.46 2.9 2.3 4.92 5.27 6.57 8.55 2.06 4.08 2.84 8.47 2.94 12.97.08 3.36-.81 6.52-3.18 9.09-.26.28-.47.6-.7.9-2.92.77-5.83 1.7-8.9 1.15-2.7-.48-5.38-1.07-8.03-1.73-.58-.14-1.07-.75-1.53-1.22-1.66-1.69-3.38-3.35-4.92-5.15-2.47-2.88-3.4-6.28-2.95-10.05.17-1.43.29-2.86.45-4.29.43-3.76 1.72-7.17 4.53-9.79 1.07-1 2.41-1.7 3.63-2.54.13-.08.24-.15.36-.23z"
                    fill="#eb9b5a"
                  ></path>
                  <path d="M50.72 82.2z" fill="#f8d073"></path>
                  <path
                    d="M515.01 281.41c-.02-.71-.04-1.43-.08-2.14-.3-5.13-.62-10.27-.92-15.4-.16-2.76-.29-5.52-.43-8.28-.17-3.52-.29-7.04-.52-10.56-.26-3.99-.62-7.98-.93-11.96-.44-5.6-.84-11.21-1.3-16.81-.4-4.94-.86-9.87-1.26-14.8-.29-3.56-.47-7.13-.8-10.68-.51-5.45-1.08-10.9-1.66-16.34-.27-2.51-.53-5.02-.98-7.5-.42-2.3-2.31-3.05-4.35-1.92-.41.23-.82.51-1.26.62-3.06.77-6.13 1.47-9.19 2.26-5.6 1.43-11.21 2.83-16.78 4.38-8.65 2.42-17.27 4.97-25.9 7.46-5.14 1.48-10.3 2.93-15.43 4.45-9.99 2.96-19.96 5.98-29.95 8.95-11.64 3.46-23.28 6.9-34.93 10.32-7.62 2.24-15.15 4.73-22.55 7.6-2.08.81-3.42 2.85-2.51 5.01.06.13 0 .31-.02.67-2.19-1.58-3.93-3.33-5.26-5.43-.48-.76-1.05-1.2-1.8-1.47-3.24-1.18-6.46-2.41-9.74-3.48-2.51-.81-5.11-1.39-7.66-2.09-1.54-.43-3.12-.78-4.6-1.38-1.4-.56-2.63-1.55-4.04-2.08-7.03-2.61-14.09-5.17-21.16-7.68-5.96-2.12-11.96-4.13-17.91-6.27-7.95-2.86-15.86-5.82-23.81-8.7-6.75-2.44-13.52-4.85-20.3-7.21-4.64-1.62-9.3-3.16-13.96-4.69-2.74-.9-5.49-1.75-8.26-2.54-2.05-.58-4.13-1.03-6.2-1.55-1.1-.27-2.23-.47-3.29-.87-3.5-1.3-6.96-2.72-10.47-4-5.91-2.14-11.83-4.25-17.77-6.3-4.82-1.66-9.68-3.22-14.53-4.82-4.66-1.53-9.34-3.01-13.99-4.59-4.56-1.55-9.07-3.26-13.64-4.8-3.02-1.02-6.12-1.28-9.07-.36l.12 2.38h-.05c-2.44.08-5.2-4.91-5.96-2.71-2.68 7.72-.85 22.18 1.95 29.14-2.49 6.68-.33 13.86 3.51 20.16-.49 1.27-.68 2.65-.51 3.97 2.96 22.34 5.93 44.68 8.89 67.02 2.36 17.77 4.52 35.77 10.92 52.56-.09.98-.16 1.96-.21 2.94-.89 17.38 3.58 34.12 8.49 50.62l-1.95-.2c.87.93 1.34 2.07 2.49 2.59.03-.09.07-.17.1-.25 0 .01.01.02.01.03 1.16 3.86 4.3 6.9 8.64 6.15 1.34-.23 2.69-.94 3.8-1.94 1.56.08 3.09.18 4.63.16 2.45-.04 4.9-.24 7.36-.36 3.87-.19 7.74-.36 11.61-.55 4.11-.2 8.17-.69 12.19-1.64 5.61-1.33 11.28-2.44 16.94-3.55 7.47-1.46 14.97-2.78 22.44-4.24 7.84-1.53 15.68-3.1 23.49-4.78 5.36-1.16 10.68-2.51 16.01-3.83 9.42-2.34 18.82-4.8 28.26-7.07 9.81-2.36 19.65-4.59 29.49-6.8 8.72-1.96 17.47-3.83 26.21-5.68 3.04-.64 6.11-1.1 9.34-1.68-.06.54-.14.92-.12 1.29.1 1.74 1.76 3.11 3.34 2.69 2.61-.7 5.2-1.45 7.78-2.25 4.54-1.39 9.05-2.84 13.58-4.26 7.33-2.29 14.65-4.63 22.01-6.83 5.99-1.79 12.03-3.45 18.06-5.11 6.12-1.69 12.28-3.22 18.37-5 6.33-1.85 12.61-3.84 18.87-5.9 5.91-1.94 11.77-4.02 17.65-6.08 3.37-1.18 6.71-2.42 10.07-3.64 5.81-2.11 11.62-4.22 17.42-6.35 2.41-.85 4.06-3.43 3.97-6.02z"
                    fill="#f9d173"
                  ></path>
                  <path
                    d="M489.26 505.17c-.93-.9-1.82-1.83-2.77-2.78.05-.22.1-.45.18-.67 1.08-2.84.9-5.64-.17-8.43a20.806 20.806 0 0 0-4.55-7.1c-2.52-2.61-5.5-4.63-8.54-6.55-8.33-5.26-17.05-9.78-25.97-13.93-12.09-5.62-24.24-11.1-36.32-16.74-9.99-4.67-19.85-9.61-29.89-14.17-10.61-4.81-21.35-9.33-32.03-13.98-.74-.32-1.45-.72-2.2-1.03-.31-.13-.68-.19-1.01-.16-1.11.11-1.64-.28-1.83-1.39-.04-.25-.06-.69-.19-.73-.76-.25-.6-.92-.67-1.44-.37-2.95-.58-5.92-1.07-8.85-1.69-10.12-3.46-20.23-5.24-30.33-.47-2.63-1.24-5.21-1.61-7.85-1.3-9.28-2.47-18.58-3.69-27.88 11.12-2.38 22.39-4.79 33.83-7.24.03-.27.09-.5.11-.66-.17-1.67-.34-3.33-.52-5-.06-.48-.01-1.22-.28-1.39-.54-.33-.53-.78-.61-1.21-.18-.94-.33-1.89-.44-2.84-.76-6.62-1.43-13.24-2.29-19.85-.76-5.8-1.76-11.56-2.56-17.35-.98-7.12-1.66-14.28-2.84-21.37-1.21-7.28-2.88-14.47-4.32-21.71-1.91-9.68-3.84-19.35-5.67-29.04-.42-2.24-1.59-3.56-3.69-4.29-2.52-.88-5.02-1.85-7.48-2.88-5.24-2.2-19.41-7.12-19.41-7.49l-13.2-104.12c0-1.31-1.3-6.56-1.95-7.52-1.14-1.65-2.39-3.24-3.53-4.9-3.43-4.98-6.81-9.98-10.24-14.96-.65-.95-1.32-1.92-2.16-2.68-1.86-1.69-4.79-.82-5.19 1.56-.29 1.7-.22 3.42.82 4.98 1.77 2.68 3.4 5.46 5.24 8.09 2.88 4.12 5.87 8.17 8.85 12.23.42.57 1.24 1.15 1.24 1.63l12.21 102.54c-5.47-2.27-22.23-9.46-27.78-11.52-26.15-9.74-52.48-18.97-79.05-27.52-16.98-5.46-34-10.79-51-16.2-5.89-1.88-11.72-3.96-17.65-5.71-6.7-1.98-13.48-3.7-20.19-4.89-.92-1.35-1.7-2.67-2.66-3.85-1.24-1.53-2.57-2.98-3.94-4.39-5.17-5.29-10.19-10.71-14.74-16.54-.5-.64-1.06-1.25-1.68-1.77-1.85-1.54-4.33-1.58-6.09-.14-1.71 1.39-2.18 3.77-1.08 5.87.44.83 1.06 1.59 1.66 2.33 5.97 7.31 12.7 13.86 19.92 19.91.32.27.62.56.73.66-.22 1.09-.52 1.96-.56 2.84-.12 2.83-.22 5.65-.18 8.48.02 2.2.04 4.43.44 6.58 1.5 8.1 2.35 16.3 3.43 24.46 1.03 7.79 2.22 15.55 3.38 23.32 1.59 10.65 3.19 21.31 4.85 31.96 2.13 13.68 4.28 27.35 6.5 41.02 2.01 12.34 4.33 24.64 6.12 37.01 2.48 17.18 5.29 34.29 8.44 51.35 1.13 6.12 2.5 12.2 3.87 18.27.84 3.73 1.88 7.42 2.82 11.14 2.28 9.01 4.67 18.01 6.79 27.06 2.38 10.17 4.45 20.42 6.78 30.61 1.73 7.57 3.26 15.2 5.74 22.58.05.16.03.35.06.62-2.72.74-5.06 2.11-7.18 3.88-4 3.34-7.24 7.31-9.48 11.99-1.86 3.88-3.4 7.92-5.05 11.9-.24.57-.36 1.19-.5 1.8-.9 3.81-.55 7.62-.06 11.44.49 3.88 2.63 6.84 5.18 9.56 1.09 1.17 2.55 1.86 4.11 2.27.88.23 1.79.37 2.66.64 3.35 1.07 6.62.76 9.85-.5 5.23-2.03 9.04-5.73 11.91-10.42 5.48-8.95 7.15-18.8 6.65-29.13l-.07-1.39c.67.36 1.13.6 1.59.86 2.22 1.24 4.4 2.56 6.66 3.71 7.39 3.76 14.81 7.47 22.23 11.17 17.12 8.54 34.33 16.9 52.04 24.16 15.34 6.29 30.65 12.68 46.01 18.95 10.92 4.46 21.89 8.8 32.83 13.2.5.2 1 .42 1.7.71-.46.24-.67.35-.88.45-2.01.91-4.13 1.62-5.99 2.77-9.39 5.78-15.96 18.63-15.27 29.63.25 3.97 1.29 7.66 4.01 10.71l2.01 2.25c1.3 1.46 2.87 2.54 4.69 3.24 1.34.51 2.69 1.01 4.05 1.48 2.95 1.01 5.93 1.04 8.92.2 4.08-1.15 7.19-3.71 9.87-6.89 6.95-8.27 10.32-17.85 10.39-28.6.03-4.07-.82-7.91-3.42-11.2-.05-.06-.02-.18-.02-.29.13-.04.26-.1.4-.12 7.37-1.05 14.34-3.44 21.1-6.49 7.43-3.36 14.88-6.68 22.56-9.43 9.8-3.51 19.49-7.31 28.93-11.71 7.91-3.69 15.8-7.42 23.7-11.12.49-.23 1.01-.42 1.51-.63l.21.24c-.2.46-.39.93-.6 1.39-2.24 4.98-3.62 10.2-4.25 15.62-.55 4.77.17 9.36 2.17 13.75 1.05 2.31 2.53 4.27 4.49 5.9 3.9 3.23 8.18 3.79 12.79 1.86 4.58-1.91 7.96-5.25 10.78-9.24 2.43-3.44 4.08-7.27 5.6-11.16 2.22-5.68 3.39-11.59 3.38-17.7-.01-5.3-1.6-10-5.49-13.77zM147.32 366.65c-.42.15-.8.29-1.33.48-.26-1.46-.52-2.91-.77-4.36-2.56-14.68-5.26-29.34-7.62-44.05-2.02-12.58-3.98-25.17-6.34-37.7-3.33-17.65-6.44-35.34-9.04-53.12-1.47-10-3.15-19.97-4.71-29.95-1.24-7.95-2.5-15.9-3.64-23.86-.93-6.49-1.64-13.01-2.54-19.51-.52-3.79-1.22-7.56-1.83-11.34-.07-.42-.04-.86-.09-1.29-.06-.51-.03-.86.58-1.1.43-.16.74-.67 1.24-1.17 2.72.68 5.54 1.44 8.39 2.07 8.55 1.88 16.7 5.05 25.01 7.68 15.67 4.96 31.39 9.82 47.03 14.89 21.84 7.08 43.69 14.18 65.33 21.86 11.97 4.25 23.99 8.37 35.97 12.58 4.31 1.51 8.58 3.16 12.89 4.71 5.79 2.08 11.59 4.1 17.38 6.17 5.55 1.98 11.09 4 16.65 5.96.75.26 1.04.65 1.12 1.42 1.33 13.02 3.26 25.95 5.83 38.78 1.83 9.13 2.84 18.36 3.91 27.6.78 6.76 1.96 13.47 2.79 20.22.85 6.89 1.5 13.81 2.25 20.72.14 1.23.36 2.46.57 3.92-7.21 1.6-14.25 3.22-21.3 4.72-9.05 1.92-18.09 3.84-27.17 5.56-17.55 3.32-35.07 6.8-52.7 9.71-12.61 2.08-25.14 4.67-37.73 6.91-10.19 1.81-20.42 3.35-30.6 5.17-7.87 1.41-15.69 3.14-23.55 4.61-5.18.97-10.39 1.74-15.67 2.62-.1-.29-.2-.58-.31-.91zm26.41 99.67c-.36.12-.73.2-1.22.33-.16-.41-.35-.78-.45-1.18-1.57-6.28-3.23-12.54-4.68-18.84-2.15-9.3-3.97-18.67-6.25-27.93-2.53-10.28-5.39-20.49-8.16-30.71-1.04-3.81-2.24-7.58-3.36-11.37-.15-.53-.3-1.07-.5-1.78.82-.17 1.54-.35 2.27-.46 11.89-1.79 23.63-4.4 35.41-6.77 6.89-1.39 13.87-2.35 20.8-3.6 16.83-3.03 33.63-6.15 50.46-9.18 8.3-1.49 16.64-2.74 24.92-4.29 13.37-2.5 26.71-5.15 40.06-7.74.1-.02.19-.01.46-.02.2 1.77.46 3.55.59 5.34 1.04 13.81 3.32 27.46 5.53 41.12 1.6 9.89 2.9 19.83 4.33 29.74.02.14-.02.29-.03.55-.51.16-1.04.34-1.6.49-11.05 3.03-22.07 6.13-32.93 9.81-15.39 5.21-30.89 10.11-46.53 14.53-11.63 3.29-23.37 6.15-35 9.41-14.72 4.12-29.6 7.72-44.12 12.55zm302.42 32.72c-2.27 1.35-4.53 2.74-6.91 3.85-7.91 3.67-15.9 7.19-23.83 10.84-6.49 2.99-12.84 6.3-19.41 9.09-8.25 3.51-16.63 6.73-25.02 9.87-8.05 3.01-15.84 6.61-23.7 10.05-5.3 2.32-10.77 4.04-16.5 4.9-2.6.39-5.09-.02-7.49-.92-5.48-2.05-10.94-4.13-16.36-6.33-13.54-5.51-27.05-11.1-40.58-16.65-14.11-5.79-28.29-11.39-42.29-17.42-10.78-4.65-21.36-9.76-31.96-14.82-11.72-5.6-23.36-11.37-35.03-17.07-.42-.2-.82-.45-1.52-.84.75-.27 1.24-.5 1.75-.64 5.64-1.55 11.29-3.09 16.93-4.63 16.97-4.62 33.99-9.1 50.92-13.9 16.94-4.8 33.6-10.46 50.17-16.4 6-2.15 12.09-4.06 18.14-6.08.35-.12.71-.19 1.07-.28l.18.27c-.3.36-.6.72-.9 1.05-3.95 4.54-7.43 9.41-10.08 14.83-2.9 5.93-3.7 12.06-1.68 18.43.91 2.88 2.34 5.47 4.48 7.62 3.6 3.61 7.86 4.76 12.79 3.35 4.18-1.2 7.69-3.51 10.49-6.78 5.5-6.44 9.83-13.59 12.33-21.74 1.19-3.88 1.54-7.78.1-11.72-.4-1.09-.42-2.32-.61-3.48.16-.04.27-.11.33-.08 10.75 4.73 21.54 9.38 32.22 14.25 8.54 3.9 16.93 8.16 25.45 12.11 12.74 5.9 25.57 11.63 38.32 17.53 7.49 3.47 14.76 7.35 21.69 11.86 1.52.99 2.97 2.11 4.37 3.27 1.27 1.05 2.27 2.34 2.93 3.87.63 1.47.57 1.94-.79 2.74z"
                    fill="#19124f"
                  ></path>
                  <g fill="#e1295a">
                    <path d="M411.78 78.39c.3-1.28.68-2.54 1.14-3.77 2.97-6.85 5.87-13.76 9.07-20.51 4.34-9.22 8.88-18.35 13.45-27.46 1.31-2.45 2.76-4.82 4.33-7.11a7.95 7.95 0 0 1 3.91-3.09c2.06-.88 4.44-.47 6.1 1.03a5.5 5.5 0 0 1 1.95 5.86c-.26.99-.59 1.96-1.01 2.89-4.39 10.33-8.8 20.65-13.18 30.97-3.48 8.03-7.53 15.79-12.13 23.24-.86 1.38-1.92 2.63-3.14 3.7a5.998 5.998 0 0 1-6.93.91c-2.37-1.18-3.54-3.21-3.56-6.66zM447.78 108.51c.37-1.53.83-3.04 1.36-4.52a109.31 109.31 0 0 1 15.81-26.88c4.4-5.51 9.06-10.82 13.63-16.2a16.38 16.38 0 0 0 3.17-4.72c.73-2.16 2.76-3.6 5.03-3.6 2.42-.13 4.7 1.15 5.84 3.3a7.229 7.229 0 0 1 .3 7.13 41.97 41.97 0 0 1-4.75 7.63 312.024 312.024 0 0 0-25.87 37.52c-.86 1.46-1.82 2.85-2.87 4.18-2.1 2.83-6.09 3.43-8.92 1.33-.37-.28-.71-.59-1.02-.94a7.827 7.827 0 0 1-1.71-4.23zM388.1 13.49c-1.05 15.97-4.48 31.7-10.18 46.66-.57 1.59-1.32 3.11-2.25 4.52-2.3 3.36-6.47 4.1-9.3 1.74a6.755 6.755 0 0 1-2.21-6.57c.42-2.98.88-5.97 1.58-8.89 2.3-9.48 4.77-18.94 7.11-28.43 1.09-4.45 2.04-8.93 3.11-13.38a7.74 7.74 0 0 1 2.15-4.11 5.395 5.395 0 0 1 5.86-1.26c2.16.78 3.68 2.74 3.87 5.03.23 1.85.21 3.72.26 4.69z"></path>
                  </g>
                </svg>
              </div>
            )}
            {cartItems.length > 0 && (
              <div className="w-[30%] border-2 p-3 rounded-md mt-3">
                <Formik
                  enableReinitialize
                  initialValues={{
                    name: resultCustomer.data?.customer.name,
                    location: resultCustomer.data?.customer.location,
                  }}
                  validate={(values) => {
                    const errors = {};
                    if (!values.name) {
                      errors.name = 'Please enter your name';
                    } else if (values.name.length >= 50) {
                      errors.name = 'Name must less than 50 characters';
                    }
                    if (!values.location) {
                      errors.location = 'Please enter the location';
                    } else if (values.location.length >= 20) {
                      errors.name = 'Location must less than 20 characters';
                    }
                    return errors;
                  }}
                  onSubmit={(values) => {
                    handleSubmit(values.name, values.location);
                  }}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div
                        className="flex justify-between mb-2 items-center"
                        onChange={(event) => setName(event.target.value)}
                      >
                        <label className="text-gray-700 text-base font-bold mr-3">
                          Name:
                        </label>
                        <Field
                          className="border-2 px-2 w-[70%] rounded-md shadow appearance-none py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          type="text"
                          name="name"
                        />
                      </div>
                      <ErrorMessage
                        className="text-red-500 text-xs italic"
                        name="name"
                        component="div"
                      />
                      <div
                        className="flex justify-between mb-2 items-center"
                        onChange={(event) => setLocation(event.target.value)}
                      >
                        <label className="text-gray-700 text-base font-bold mr-3">
                          Location:
                        </label>
                        <Field
                          className="border-2 px-2 w-[70%] rounded-md shadow appearance-none py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          type="text"
                          name="location"
                        />
                      </div>
                      <ErrorMessage
                        className="text-red-500 text-xs italic"
                        name="location"
                        component="div"
                      />
                      <div className="w-full border-t-2 mt-2">
                        {cartItems.length > 0 && (
                          <div>
                            <div className="flex justify-between my-2">
                              <span>Subtotal</span>
                              <span className="font-bold">
                                ${subTotal || '0'}
                              </span>
                            </div>
                            <div className="flex justify-between mb-2">
                              <span>Shipping</span>
                              <span className="font-bold">
                                ${fee?.shipping || '0'}
                              </span>
                            </div>
                            <div className="flex justify-between mb-2">
                              <span>Tax</span>
                              <span className="font-bold">
                                ${fee?.tax || '0'}
                              </span>
                            </div>
                            <div className="flex justify-between mb-2">
                              <span>Total</span>
                              <span className="font-bold">
                                ${subTotal + fee?.shipping + fee?.tax || '0'}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end">
                        <button
                          className={`py-1 px-2 font-semibold rounded-md mt-3 bg-[#907c6e] text-white ${
                            !submitting ? 'hover:bg-[#ae9a8c]' : ''
                          }`}
                          type="submit"
                          disabled={submitting}
                        >
                          Checkout
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            )}
          </div>
        </div>
        <ConfirmModal
          isShowModal={isShowModal}
          setIsShowModal={setIsShowModal}
          handleAcceptButton={() => handleSave(name, location)}
          handleCancelButton={handleCancel}
          isHandleCloseButton={false}
          modalContent={{
            content: 'Are you want to save your changing before leaving?',
            buttonAccept: 'Save',
            buttonCancel: 'Cancel',
          }}
        />
      </MainLayout>
    </>
  );
};

export default Checkout;
