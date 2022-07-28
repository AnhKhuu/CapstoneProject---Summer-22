import React from 'react';
import './form.css';
import { render } from 'react-dom';
import { Formik, Field } from 'formik';
import * as yup from 'yup';
import { ADD_PRODUCT } from '../../graphql/mutations';
import { useMutation } from '@apollo/client';

const Schema = yup.object().shape({
  name: yup
    .string()
    .min(2, 'Too short')
    .max(144, 'Too long')
    .required('Required'),
  price: yup
    .number('Must be a number')
    .positive('Must be positive')
    .integer('Must be integer')
    .required('Required'),
  stock: yup
    .number('Must be a number')
    .positive('Must be positive')
    .integer('Must be integer')
    .required('Required'),
  description: yup.string().min(2, 'Too short').max(1000, 'Too long'),
  catergories: yup.string(),
});
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
        name: '',
        price: '',
        stock: '',
        colors: [{ name: 'red', hexValue: '1234' }],
        categories: '',
        pictures: '',
        sizes: '',
        description: '',
      }}
      validationSchema={Schema}
      onSubmit={async (product) => {
        // console.log(product);
        addProduct({
          variables: {
            product: {
              ...product,
              price: product.price,
              stock: product.stock,
              categories: product.categories.split('; '),
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
          <form className="add-new" onSubmit={handleSubmit}>
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
              placeholder="Enter price ($)"
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
              placeholder="Enter stock"
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
              placeholder="Enter short description"
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
              placeholder="Enter Categories, separated by semicolon"
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
              placeholder="Enter picture URL"
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
              placeholder="Enter size"
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
