import React, { useState, useCallback } from 'react';
import { useStore } from '../../store/hooks';
import ConfirmModal from './ConfirmModal';
import {
  increment,
  decrement,
  removeItem,
  addToCheckout,
} from '../../store/actions';

const Item = ({ item, index, checkoutState }) => {
  const [isShowModal, setIsShowModal] = useState(false);
  const [state, dispatch] = useStore();

  const handleModify = useCallback(
    (type) => {
      if (type === 'increment' && item.quantity >= item.stock) {
        alert('Item quantity reach limitation!');
        return;
      }
      if (type === 'decrement' && item.quantity <= 1) {
        setIsShowModal(true);
      }
      if (type === 'increment') {
        dispatch(increment(index));
      } else {
        dispatch(decrement(index));
      }
    },
    [isShowModal]
  );

  const handleRemoveItem = useCallback(() => {
    dispatch(removeItem(index));
    setIsShowModal(false);
  }, [isShowModal]);

  const handleCancelRemoveItem = useCallback(() => {
    dispatch(increment(index));
    setIsShowModal(false);
  }, [isShowModal]);

  return (
    <div className="flex">
      <input
        type="checkbox"
        onChange={() => dispatch(addToCheckout(index))}
        checked={checkoutState[index]}
      />
      <img src={item.pictures[0]} className="w-24 h-24"></img>
      <div>
        <p>{item.name}</p>
        <p>Color: {item.color}</p>
        <p>Size: {item.size}</p>
        <div>
          <button
            className="border-2"
            onClick={() => handleModify('decrement')}
          >
            -
          </button>
          <span>{item.quantity}</span>
          <button
            className="border-2"
            onClick={() => handleModify('increment')}
          >
            +
          </button>
        </div>
        <p>${item.quantity * item.price}</p>
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

export default Item;
