import React, { useState } from 'react';
import { DELETE_PRODUCT } from '../../graphql/mutations';
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
//import ProductForm from './ProductForm';
import DeleteConfirmation from './DeleteConfirm';

function Product({ product }) {
  const [showModal, setShowModal] = useState(false);

  const hideConfirmationModal = () => setShowModal(false);

  const [deleteProduct, { data, loading, error }] = useMutation(
    DELETE_PRODUCT,
    {
      variables: { removeProductId: product.id },
    }
  );
  if (loading) return <div> Loading... </div>;
  if (error) return <div> Something went wrong {error.message} </div>;
  if (data) {
    // alert(JSON.stringify(data))
    return;
  }

  const handleEdit = async () => {};
  const colors = product.colors.map((c) => c.name).join(', ');

  return (
    <div className="w-64 h-auto bg-blue-200 rounded-lg ml-10 mr-10 mb-10 border-b-2 transform transition duration-500 hover:scale-110 hover:bg-blue-300 ">
      <div className="relative w-full flex justify-center pt-5">
        <img src={product.pictures[0]} className="h-auto w-auto" />
      </div>
      <div className="relative p-5 flex justify-center items-center flex-col">
        <h3 className="text-center text-lg text-black font-bold uppercase">
          {product.name}
        </h3>
        <h2 className="text-center text-lg text-black font-semibold">
          Price: {product.price}$
        </h2>
        <h2 className="text-center text-lg text-black font-semibold">
          Stock: {product.stock}
        </h2>
        <h2 className="text-center text-lg text-black font-semibold">Colors: {colors}</h2>
      </div>
      <div className="inline-flex w-18 h-8 bg-transparent space-x-16 rounded-lg mb-4 ml-8">
        <button
          className="w-auto h-10 block items-center py-2 px-3 text-sm text-center text-white bg-blue-200 rounded-lg hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={() => setShowModal(true)}
        >
          Remove
        </button>

        <DeleteConfirmation
          showModal={showModal}
          confirmModal={() => deleteProduct()}
          hideModal={() => setShowModal(false)}
          message={'Are you sure you want to delete this item?'}
        />
        <Link to={`/edit_product/${product.id}`}>
          <button className="w-auto h-10 block items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-200 rounded-lg hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Edit
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Product;
