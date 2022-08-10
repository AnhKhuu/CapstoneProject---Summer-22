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
        alert('The number of products has reached the limit!');
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
    [item.quantity, item.stock, isShowModal]
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
    <div className="flex w-full border-t-2 py-6">
      <div className="w-[15%] text-center my-auto">
        <input
          type="checkbox"
          onChange={() => dispatch(addToCheckout(index))}
          checked={checkoutState[index]}
          className="cursor-pointer"
        />
      </div>
      <div className="w-1/2 flex items-center">
        <img src={item.pictures[0]} className="w-24 h-24 mr-3"></img>
        <p className="text-sm">
          <p className="font-semibold">{item.name}</p>
          <p>Color: {item.color}</p>
          <p>Size: {item.size}</p>
        </p>
      </div>
      <div className="w-[15%] text-center my-auto">
        <div className="rounded-2xl border-2 flex justify-around h-9 items-center">
          <button
            className="hover:text-[#907c6e] transition ease-in hover:text-2xl text-base w-[30%]"
            onClick={() => handleModify('decrement')}
          >
            -
          </button>
          <span className="w-[40%]">{item.quantity}</span>
          <button
            className="hover:text-[#907c6e] transition ease-in hover:text-2xl text-base w-[30%]"
            onClick={() => handleModify('increment')}
          >
            +
          </button>
        </div>
      </div>
      <p className="w-[20%] text-center my-auto">
        ${item.quantity * item.price}
      </p>
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
