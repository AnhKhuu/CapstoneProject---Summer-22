import React from 'react';

const ConfirmModal = ({
  isShowModal,
  handleCancelButton,
  handleAcceptButton,
  modalContent,
  setIsShowModal,
  isHandleCloseButton,
}) => {
  return (
    <div
      className={`${
        isShowModal ? '' : 'hidden'
      } flex justify-center items-center fixed top-0 bottom-0 left-0 right-0 transition-opacity duration-[5000ms] bg-gray-400 bg-opacity-70`}
    >
      <div className="bg-white rounded-md px-5 relative ease-in-out duration-[5000ms] w-1/3 py-3">
        <p>{modalContent.content}</p>
        <span
          className="absolute top-0 right-5 duration-200 text-3xl cursor-pointer hover:text-[#907c6e]"
          onClick={
            isHandleCloseButton
              ? () => handleCancelButton()
              : () => setIsShowModal(false)
          }
        >
          &times;
        </span>
        <div className="text-right mt-3">
          <button
            className="rounded-lg px-3 py-1 mr-4 bg-[#907c6e] text-white hover:bg-[#ae9a8c]"
            onClick={() => handleAcceptButton()}
          >
            Yes
          </button>
          <button
            className="text-red-600 hover:text-red-400"
            onClick={() => handleCancelButton()}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
