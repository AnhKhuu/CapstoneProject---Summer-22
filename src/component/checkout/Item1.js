import React, { useState, useCallback } from 'react';
import { useStore } from '../../store/hooks';
import { UPDATE_CART } from '../../graphql/mutations';
import { useMutation } from '@apollo/client';
import ConfirmModal from './ConfirmModal';

const Item1 = ({
  product,
  quantity,
  color,
  size,
  refetchData,
  customerList,
  customerId,
  fetchingData,
}) => {
  const [updateCart, { data, loading, error }] = useMutation(UPDATE_CART);
  const [itemQuantity, setItemQuantity] = useState(quantity);
  const [isShowModal, setIsShowModal] = useState(false);

  const handleModify = useCallback((type) => {
    let quantity;
    if (type == 'increment' && itemQuantity >= product.stock) {
      alert('Item quantity reach limitation!');
      return;
    }
    if (type == 'decrement' && itemQuantity <= 1) {
      setIsShowModal(true);
    }
    if (type === 'increment') {
      quantity = itemQuantity + 1;
    } else {
      quantity = itemQuantity - 1;
    }
    const itemIndex = customerList.findIndex(
      (item) => item.productId === product.id
    );
    const newList = [...customerList];
    newList[itemIndex] = {
      ...newList[itemIndex],
      productId: product.id,
      color: color,
      size: size,
      quantity: quantity,
    };
    setItemQuantity(quantity);
    try {
      updateCart({
        variables: {
          customer: {
            customerId: customerId,
            items: [...newList],
          },
        },
      });
      refetchData();
    } catch (error) {
      console.log(error);
    }
  });

  const handleRemoveItem = useCallback(async () => {
    const itemIndex = customerList.findIndex(
      (item) => item.productId === product.id
    );
    const newList = [...customerList]
      .slice(0, itemIndex)
      .concat([...customerList].slice(itemIndex + 1));
    try {
      await updateCart({
        variables: {
          customer: {
            customerId: customerId,
            items: [...newList],
          },
        },
      });
      fetchingData();
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  });

  const handleCancelRemoveItem = useCallback(async () => {
    const quantity = 1;
    const itemIndex = customerList.findIndex(
      (item) => item.productId === product.id
    );
    const newList = [...customerList];
    newList[itemIndex] = {
      ...newList[itemIndex],
      productId: product.id,
      color: color,
      size: size,
      quantity: quantity,
    };
    setItemQuantity(quantity);
    try {
      updateCart({
        variables: {
          customer: {
            customerId: customerId,
            items: [...newList],
          },
        },
      });
      setIsShowModal(false);
      refetchData();
    } catch (error) {
      console.log(error);
    }
  }, [setItemQuantity, setIsShowModal]);

  return (
    <div className="flex">
      <img src={product.pictures[0]} className="w-24 h-24"></img>
      <div>
        <p>{product.name}</p>
        <p>Color: {color}</p>
        <p>
          Size:
          {size}
        </p>
        <div>
          <button
            className="border-2"
            onClick={() => handleModify('decrement')}
          >
            -
          </button>
          <span>{quantity}</span>
          <button
            className="border-2"
            onClick={() => handleModify('increment')}
          >
            +
          </button>
        </div>
        <p>${quantity * product.price}</p>
      </div>
      <ConfirmModal
        isShowModal={isShowModal}
        setIsShowModal={setIsShowModal}
        handleAcceptButton={handleRemoveItem}
        handleCancelButton={handleCancelRemoveItem}
        isHandleCloseButton={true}
        modalContent={{
          content: 'Are you want to remove this item out of your cart?',
          buttonAccept: 'Remove',
          buttonCancel: 'Cancel',
        }}
      />
    </div>
  );
};

export default Item1;
