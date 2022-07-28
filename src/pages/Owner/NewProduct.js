import React from 'react';
import './form.css';
import { Formik, yupToFormErrors } from 'formik';
import * as yup from 'yup';
import { ADD_PRODUCT } from '../../graphql/mutations';
import { useMutation } from '@apollo/client';
import { GithubPicker } from 'react-color';

const defaultColors = {
  '#111011': 'Black',
  '#016541': 'Green',
  '#ffce6f': 'Yellow',
  '#fbfbfa': 'White',
  '#b0b3b6': 'Heather Grey',
  '#263037': 'Denim Heather',
  '#312f3f': 'Navy',
  '#353d77': 'Blue',
  '#e4d6c5': 'Creme',
  '#9cc0d5': 'Light Blue',
  '#dd2020': 'Red',
  '#5e504c': 'Dark Grey',
  '#a0c640': 'Kiwi',
  '#413d33': 'Army',
  '#13290c': 'Forest Green',
  '#fec6ca': 'Light Pink',
  '#541e69': 'Purple',
  '#581f33': 'Dark Red',
  '#f89e2a': 'Gold',
  '#575634': 'Moss Green',
  '#403a3b': 'Charcoal Heather',
};

// const colorHex = Object.keys(defaultColors);
// const colorName = Object.values(defaultColors);

const Schema = yup.object({
  name: yup
    .string()
    .min(2, 'Too short')
    .max(144, 'Too long')
    .required('Name is required'),
  price: yup
    .number('Must be a number')
    .positive('Must be positive')
    .integer('Must be integer')
    .required('Price is required'),
  stock: yup
    .number('Must be a number')
    .positive('Must be positive')
    .integer('Must be integer')
    .required('Stock is required'),
  colors: yup.string().required('Color is required'),
  description: yup.string().min(2, 'Too short').max(1000, 'Too long'),
  catergories: yup.string(),
});
const NewProductForm = () => {
  const [addProduct, _] = useMutation(ADD_PRODUCT, {
    variables: {},
  });

  return (
    <Formik
      initialValues={{
        name: '',
        price: '',
        stock: '',
        colors: '',
        categories: '',
        pictures: '',
        sizes: '',
        description: '',
      }}
      validationSchema={Schema}
      onSubmit={async (product) => {
        addProduct({
          variables: {
            product: {
              ...product,
              price: product.price,
              stock: product.stock,
              categories: product.categories.split('; '),
              pictures: [product.pictures],
              sizes: [product.sizes],
              colors: [
                {
                  name: defaultColors[product.colors],
                  hexValue: product.colors,
                },
              ],
            },
          },
        });
      }}
    >
      {(props) => {
        const {
          values,
          isSubmitting,
          handleChange,
          handleSubmit,
          errors,
          touched,
        } = props;
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
            {errors.name && touched.name ? (
              <div className="error-msg">{errors.name}</div>
            ) : null}
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
            {errors.name && touched.name ? (
              <div className="error-msg">{errors.name}</div>
            ) : null}
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
            {errors.name && touched.name ? (
              <div className="error-msg">{errors.name}</div>
            ) : null}
            <label htmlFor="color" style={{ display: 'block' }}>
              Color
            </label>
            <GithubPicker
              onChange={(color, _e) => {
                values.colors = color.hex;
                console.log(values);
              }}
              colors={Object.keys(defaultColors)}
            />
            {errors.name && touched.name ? (
              <div className="error-msg">{errors.name}</div>
            ) : null}
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
            {errors.name && touched.name ? (
              <div className="error-msg">{errors.name}</div>
            ) : null}
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
            {errors.name && touched.name ? (
              <div className="error-msg">{errors.name}</div>
            ) : null}
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
            {errors.name && touched.name ? (
              <div className="error-msg">{errors.name}</div>
            ) : null}
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
            {errors.name && touched.name ? (
              <div className="error-msg">{errors.name}</div>
            ) : null}
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