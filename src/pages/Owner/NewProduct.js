import React, { useState } from 'react';
import './helper.css';
import { render } from 'react-dom';
import { Formik } from 'formik';
import { ADD_PRODUCT } from '../../graphql/mutations';
import { useMutation } from '@apollo/client';

const NewProductForm = () => {
  // const [addProduct, { data, loading, error }] = useMutation(ADD_PRODUCT, {
  //   variables: { removeProductId: product.id },
  // });

  const [addProduct, { data, loading, error }] = useMutation(ADD_PRODUCT, {
    variables: {},
  });

  return (
    <Formik
      initialValues={{
        name: 'vay',
        price: 123,
        stock: 23,
        colors: [{ name: 'red', hexValue: '1234' }],
        categories: '',
        pictures: '',
        sizes: '',
        description: '',
      }}
      onSubmit={async (product) => {
        // console.log(product);
        addProduct({
          variables: {
            product: {
              ...product,
              categories: product.categories.split(','),
              pictures: [product.pictures],
              sizes: [product.sizes],
            },
          },
        });
      }}
    >
      {(props) => {
        const { values, isSubmitting, handleChange, handleSubmit } = props;
        return (
          <form onSubmit={handleSubmit}>
            <label htmlFor="name" style={{ display: 'block' }}>
              Name
            </label>
            <input
              id="name"
              placeholder="Enter product name"
              type="text"
              value={values.name}
              onChange={handleChange}
              className="text-input"
            />
            <label htmlFor="price" style={{ display: 'block' }}>
              Price
            </label>
            <input
              id="price"
              type="number"
              value={values.price}
              onChange={handleChange}
              className="text-input"
            />
            <label htmlFor="stock" style={{ display: 'block' }}>
              Stock
            </label>
            <input
              id="stock"
              type="number"
              value={values.stock}
              onChange={handleChange}
              className="text-input"
            />
            {/* <label htmlFor="color" style={{ display: 'block' }}>
              Color
            </label>
            <input
              id="color"
              placeholder="color"
              type="text"
              value={values.colors}
              onChange={handleChange}
              className="text-input"
            /> */}
            <label htmlFor="description" style={{ display: 'block' }}>
              Description
            </label>
            <input
              id="description"
              placeholder=""
              type="text"
              value={values.description}
              onChange={handleChange}
              className="text-input"
            />
            <label htmlFor="categories" style={{ display: 'block' }}>
              Catergories
            </label>
            <input
              id="categories"
              placeholder="categories, separated by semicolon"
              type="text"
              value={values.categories}
              onChange={handleChange}
              className="text-input"
            />
            <label htmlFor="pictures" style={{ display: 'block' }}>
              Picture
            </label>
            <input
              id="pictures"
              placeholder="picture"
              type="text"
              value={values.pictures}
              onChange={handleChange}
              className="text-input"
            />
            <label htmlFor="sizes" style={{ display: 'block' }}>
              Size
            </label>
            <input
              id="sizes"
              placeholder="size"
              type="text"
              value={values.sizes}
              onChange={handleChange}
              className="text-input"
            />
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </form>
        );
      }}
    </Formik>
  );
};

export default NewProductForm;
