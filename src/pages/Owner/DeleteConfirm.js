
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

// pop up when onclick delete
const DeleteConfirmation = ({
  showModal,
  hideModal,
  confirmModal,
  message,
}) => {
  return (
    <Modal
      className="justify-center bg-gray-100 ml-40 mt-40 mr-40 mb-40 w-1/2 h-1/3 content-box items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
      tabindex="-1"
      show={showModal}
      onHide={hideModal}
    >
      <Modal.Header className="text-3xl font-semibold">
        <div className="relative w-auto my-6 mx-auto max-w-3xl" />

        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none" />

        <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t" />

        <Modal.Title className="flex items-center justify-center">
          Delete Confirmation
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="flex items-center justify-center">
        <div className="my-4 text-slate-500 text-lg leading-relaxed">
          {message}
        </div>
      </Modal.Body>
      <Modal.Footer className="flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
        <Button
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          onClick={hideModal}
        >
          Cancel
        </Button>
        <Button
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
          onClick={confirmModal}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmation;
