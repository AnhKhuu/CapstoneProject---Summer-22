import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from 'react';
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

  // var groupBy = function (xs, key) {
  //   return xs.reduce(function (rv, x) {
  //     (rv[x[key]] = rv[x[key]] || []).push(x);
  //     return rv;
  //   }, {});
  // };

  // var groupProperty = function (arr, id, property) {
  //   switch (property) {
  //     case 'quantity':
  //       return arr[id].length > 1
  //         ? arr[id].reduce((prev, curr) => prev[property] + curr[property])
  //         : arr[id][0][property];
  //     case 'size':
  //       return arr[id].length > 1
  //         ? arr[id].reduce((prev, curr) => {
  //             if (prev[property] === curr[property]) {
  //               return [...prev[property]];
  //             }
  //             return [...prev[property], curr[property]];
  //           })
  //         : [arr[id][0][property]];
  //     case 'color':
  //       return arr[id].length > 1
  //         ? arr[id].reduce((prev, curr) =>
  //             prev[property] == curr[property]
  //               ? [...[prev[property]]]
  //               : [...[prev[property]], ...[curr[property]]]
  //           )
  //         : [arr[id][0][property]];
  //   }
  //   if (property === 'quantity') {
  //   }
  // };

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
          name: data.customer.name,
          location: data.customer.location,
        };
        setName(data.customer.name);
        setLocation(data.customer.location);
        const productId = data.customer.items.map((item) => {
          return item.productId;
        });
        let productDetail = [];
        for (const item of productId) {
          const detail = await getProduct({
            variables: {
              productId: item,
            },
            fetchPolicy: 'no-cache',
          });
          productDetail.push(detail.data);
        }

        const combineCustomerProduct = productDetail.map((item, index) => {
          return {
            ...item.product,
            quantity: data.customer.items[index].quantity,
            color: data.customer.items[index].color,
            size: data.customer.items[index].size,
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

        // const list = groupBy(combineCustomerProduct, 'id');

        // const listModify = Object.keys(list).map((item, index) => {
        //   const quantity = groupProperty(list, item, 'quantity');
        //   const size = groupProperty(list, item, 'size');
        //   const color = groupProperty(list, item, 'color');
        //   const itemInfo = combineCustomerProduct.find(
        //     (product) => product.id === item
        //   );
        //   return {
        //     ...itemInfo,
        //     quantity: quantity,
        //     size: size,
        //     color: color,
        //   };
        // });

        // if (listModify.length > 0) {
        //   dispatch(queryCartItems(listModify));
        // }

        if (data.customer.location) {
          const fee = await getFee({
            variables: {
              location: data.customer.location,
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
      if (debounced.trim() == '') {
        setFee({ shipping: 0, tax: 0 });
        return;
      }
      const feeData = await getFee({
        variables: {
          location: debounced,
        },
      });
      setFee(feeData.data.fee);
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

      //   .filter((item) => item.checkout === false)
      //   .map((item) => item.productId);
      // const updateData = [];
      // for (const product of rawCombineList.current) {
      //   listNoCheckoutItems.some((item) => item === product.id)
      //     ? updateData.push(product)
      //     : product;
      // }
      // const data = updateData.map((item) => {
      //   return {
      //     productId: item.id,
      //     color: item.color,
      //     size: item.size,
      //     quantity: item.quantity,
      //   };
      // });

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
      let compare = [];
      if (arr1.length > 0) {
        compare = arr1?.map((item, index) => {
          return (
            Object.keys(item).length === Object.keys(arr2[index]).length &&
            Object.keys(item).every((p) => item[p] === arr2[index][p])
          );
        });
      }
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

  return (
    <>
      <MainLayout>
        <div className="">
          <div className="flex justify-between items-start">
            <div className="w-[70%]">
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
                    <label>Name</label>
                    <div onChange={(event) => setName(event.target.value)}>
                      <Field className="border-2" type="text" name="name" />
                      <ErrorMessage name="name" component="div" />
                    </div>
                    <div onChange={(event) => setLocation(event.target.value)}>
                      <label>Location</label>
                      <Field className="border-2" type="text" name="location" />
                      <ErrorMessage name="location" component="div" />
                    </div>
                    <button
                      type="submit"
                      disabled={subTotal == 0 || !location || resultFee.loading}
                    >
                      Checkout
                    </button>
                  </Form>
                )}
              </Formik>
              <button
                className="bg-slate-400"
                onClick={() =>
                  compareChange(
                    rawCombineList.current,
                    cartItems,
                    name,
                    location
                  )
                }
              >
                Back
              </button>
            </div>
            <div className="w-[30%]">
              <div>
                <h1>Order summary</h1>
                <input
                  type="checkbox"
                  onChange={(event) => {
                    dispatch(addAllToCheckout(event.target.checked));
                  }}
                  checked={checkoutState.every((item) => item === true)}
                />
                {cartItems.length > 0 ? (
                  cartItems?.map((item, index) => {
                    return (
                      <Item
                        key={index}
                        index={index}
                        item={item}
                        checkoutState={checkoutState}
                      />
                    );
                  })
                ) : (
                  <div>You have no item in you cart</div>
                )}
                {cartItems.length > 0 ? (
                  <div>
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{subTotal || '0'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{fee?.shipping || '0'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>{fee?.tax || '0'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total</span>
                      <span>{subTotal + fee?.shipping + fee?.tax || '0'}</span>
                    </div>
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
        </div>
        <ConfirmModal
          isShowModal={isShowModal}
          setIsShowModal={setIsShowModal}
          handleAcceptButton={() => handleSave(name, location)}
          handleCancelButton={handleCancel}
          isHandleCloseButton={false}
          modalContent={{
            content: 'Are you want to save your chaging before leaving?',
            buttonAccept: 'Save',
            buttonCancel: 'Cancel',
          }}
        />
      </MainLayout>
    </>
  );
};

export default Checkout;
