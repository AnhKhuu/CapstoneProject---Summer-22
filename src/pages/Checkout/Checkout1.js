import React, { useEffect, useState, useCallback, useRef } from 'react';
import MainLayout from '../../layout/MainLayout';
import {
  GET_CART_ITEMS,
  GET_FEE,
  GET_PRODUCT_CART_ITEMS,
} from '../../graphql/queries';
import {
  UPDATE_CUSTOMER,
  UPDATE_STOCK,
  EMPTY_CART,
  UPDATE_CART,
} from '../../graphql/mutations';
import { useMutation, useLazyQuery } from '@apollo/client';
import Item from '../../component/checkout/Item';
import ConfirmModal from '../../component/checkout/ConfirmModal';
import { useDebounce } from '../../store/hooks';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useStore, useUnload } from '../../store/hooks';
import { Link, useNavigate } from 'react-router-dom';

const Checkout = () => {
  const [getCustomerDetail, { data, error, loading }] =
    useLazyQuery(GET_CART_ITEMS);
  const [getProductDetail, productDetail] = useLazyQuery(
    GET_PRODUCT_CART_ITEMS
  );
  const [updateCustomerDetail, resultCustomerDetail] =
    useMutation(UPDATE_CUSTOMER);
  const [getFee, feeDetail] = useLazyQuery(GET_FEE);
  const [updateStock, resultStockDetail] = useMutation(UPDATE_STOCK);
  const [emptyCart, resultEmptyCart] = useMutation(EMPTY_CART);
  const [updateCart, resultUpdateCart] = useMutation(UPDATE_CART);
  const [customerDetail, setCustomerDetail] = useState();
  const [productsList, setProductsList] = useState();
  const [subTotal, setSubTotal] = useState(0);
  const [location, setLocation] = useState('');
  const [fee, setFee] = useState({ shipping: 0, tax: 0 });
  const [isShowModal, setIsShowModal] = useState(false);
  let productStorageArr = useRef(null);
  let customerStorage = useRef(null);
  const customerId = localStorage.getItem('customerId');
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        fetchingData();
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  const debounced = useDebounce(location, 500);

  const fetchingData = useCallback(async () => {
    const customerData = await getCustomerDetail({
      variables: {
        customerCustomerId2: customerId,
      },
      fetchPolicy: 'no-cache',
    });
    const newArr = customerData.data.customer.items.map((item) => {
      return {
        productId: item.productId,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
      };
    });
    setCustomerDetail(newArr);
    customerStorage.current = newArr;
    const productId = customerData.data.customer.items.map((item) => {
      return item.productId;
    });
    let productDetail = [];
    for (const item of productId) {
      const detail = await getProductDetail({
        variables: {
          productId: item,
        },
        fetchPolicy: 'no-cache',
      });
      productDetail.push(detail.data);
    }
    productStorageArr.current = productDetail;
    setProductsList(productDetail);
    const subTotalResult = productDetail
      .map((item, index) => item.product.price * newArr[index].quantity)
      .reduce((prev, curr) => prev + curr);
    setSubTotal(subTotalResult);
    if (customerData.data.customer.location) {
      const fee = await getFee({
        variables: {
          location: customerData.data.customer.location,
        },
      });
      setFee(fee.data.fee);
    }
  }, [setCustomerDetail, setProductsList, setSubTotal, setFee]);

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

  const refetchData = useCallback(async () => {
    const data = await getCustomerDetail({
      variables: {
        customerCustomerId2: customerId,
      },
      fetchPolicy: 'no-cache',
    });
    const newArr = data.data.customer.items.map((item) => {
      return {
        productId: item.productId,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
      };
    });
    setCustomerDetail(newArr);
    const subTotalResult = productStorageArr.current
      .map((item, index) => item.product.price * newArr[index].quantity)
      .reduce((prev, curr) => prev + curr);
    setSubTotal(subTotalResult);
  }, [setCustomerDetail, setSubTotal]);

  const handleUpdateStock = useCallback(async () => {
    try {
      await customerDetail.map((item, index) => {
        return updateStock({
          variables: {
            product: {
              id: item.productId,
              stock: productsList[index].product.stock - item.quantity,
            },
          },
        });
      });
      await emptyCart({
        variables: {
          emptyCartCustomerId2: customerId,
        },
      });
    } catch (error) {
      console.log(error);
    }
  });

  const handleCancel = useCallback(async () => {
    try {
      await updateCart({
        variables: {
          customer: {
            customerId: customerId,
            items: customerStorage.current,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
    navigate('/', { replace: true });
  });

  const handleSave = useCallback(() => {
    navigate('/', { replace: true });
    window.location.reload();
  });

  return (
    <MainLayout>
      <div className="">
        <div className="flex justify-between items-start">
          <div className="w-[70%]">
            <Formik
              enableReinitialize
              initialValues={{
                name: data?.customer.name,
                location: data?.customer.location,
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
                updateCustomerDetail({
                  variables: {
                    customer: {
                      customerId: customerId,
                      name: values.name,
                      location: values.location,
                    },
                  },
                });
                handleUpdateStock();
                navigate('/congratulations', { replace: true });
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <label>Name</label>
                  <Field className="border-2" type="text" name="name" />
                  <ErrorMessage name="name" component="div" />
                  <div onChange={(event) => setLocation(event.target.value)}>
                    <label>Location</label>
                    <Field className="border-2" type="text" name="location" />
                    <ErrorMessage name="location" component="div" />
                  </div>
                  <button
                    type="submit"
                    disabled={
                      subTotal == 0 || fee.shipping == 0 || fee.tax == 0
                    }
                  >
                    Checkout
                  </button>
                </Form>
              )}
            </Formik>
          </div>
          <div className="w-[30%]">
            <div>
              <h1>Order summary</h1>
              {productsList?.map(({ product }, index) => {
                return (
                  <Item
                    customerId={customerId}
                    refetchData={refetchData}
                    key={index}
                    product={product}
                    quantity={data?.customer.items[index].quantity}
                    color={data?.customer.items[index].color}
                    size={data?.customer.items[index].size}
                    customerList={customerDetail}
                    getCustomerDetail={getCustomerDetail}
                    setCustomerDetail={setCustomerDetail}
                    fetchingData={fetchingData}
                  />
                );
              })}
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{subTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{fee.shipping}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{fee.tax}</span>
              </div>
              <div className="flex justify-between">
                <span>Total</span>
                <span>{subTotal + fee.shipping + fee.tax}</span>
              </div>
            </div>
          </div>
        </div>
        <button className="" onClick={() => setIsShowModal(true)}>
          Back
        </button>
      </div>
      <ConfirmModal
        isShowModal={isShowModal}
        setIsShowModal={setIsShowModal}
        handleAcceptButton={handleSave}
        handleCancelButton={handleCancel}
        isHandleCloseButton={false}
        modalContent={{
          content: 'Are you want to save your chaging before leaving?',
          buttonAccept: 'Save',
          buttonCancel: 'Cancel',
        }}
      />
    </MainLayout>
  );
};

export default Checkout;
