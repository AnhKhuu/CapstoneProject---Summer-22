import React, { useState } from 'react';
import { Formik, yupToFormErrors } from 'formik';
import * as yup from 'yup';
import { ADD_PRODUCT, EDIT_PRODUCT } from '../../graphql/mutations';
import { useMutation, useQuery } from '@apollo/client';
import { GithubPicker } from 'react-color';
import DatePicker from 'react-datepicker';
import { GET_PRODUCT } from '../../graphql/queries';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const hexToName = {
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

const nameToHex = {
  Black: '#111011',
  Green: '#016541',
  Yellow: '#ffce6f',
  White: '#fbfbfa',
  'Heather Grey': '#b0b3b6',
  'Denim Heather': '#263037',
  Navy: '#312f3f',
  Blue: '#353d77',
  Creme: '#e4d6c5',
  'Light Blue': '#9cc0d5',
  Red: '#dd2020',
  'Dark Grey': '#5e504c',
  Kiwi: '#a0c640',
  Army: '#413d33',
  'Forest Green': '#13290c',
  'Light Pink': '#fec6ca',
  Purple: '#541e69',
  'Dark Red': '#581f33',
  Gold: '#f89e2a',
  'Moss Green': '#575634',
  'Charcoal Heather': '#403a3b',
};

const normalizeData = (product) => {
  const colors = product.colors.map((c) => c.name).join(',');
  console.log(colors);
  return {
    id: product.id,
    colors,
    pictures: product.pictures[0],
    sizes: product.sizes.join(','),
    categories: product.categories.join(','),
    price: product.price,
    stock: product.stock,
    name: product.name,
    description: product.description,
    featuringFrom: product.featuringFrom,
    featuringTo: product.featuringTo,
  };
};

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
  pictures: yup
    .string()
    .matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      'Enter correct URL'
    ),
  sizes: yup.string(),
});

const ProductForm = () => {
  const [addProduct, { data, loading, errors }] = useMutation(ADD_PRODUCT, {
    variables: {},
  });
  const [editProduct] = useMutation(EDIT_PRODUCT, {
    variables: {},
  });
  const [colour, setColour] = useState('');
  //const [startDate, setStartDate] = useState(new Date());
  const { pid } = useParams();
  const navigate = useNavigate();
  const res = useQuery(GET_PRODUCT, { variables: { productId: pid || '' } });
  if (res.loading) return <div> Loading... </div>;
  const method = pid ? 'edit' : 'new';
  const initValue = res.data.product
    ? normalizeData(res.data.product)
    : {
        name: '',
        price: '',
        stock: '',
        colors: '',
        categories: '',
        pictures: '',
        sizes: '',
        description: '',
        featuringFrom: '',
        featuringTo: '',
      };
  return (
    <Formik
      initialValues={initValue}
      validationSchema={Schema}
      onSubmit={async (product, e) => {
        e.preventDefault = true;
        const colors = (colour === '' ? initValue.colors : colour)
          .split(',')
          .map((c) => ({
            name: c,
            hexValue: nameToHex[c],
          }))
          .filter((c) => c.name && c.hexValue);
        const variables = {
          product: {
            ...product,
            price: product.price,
            stock: product.stock,
            categories: product.categories.split(';'),
            pictures: [product.pictures],
            sizes: [product.sizes],
            colors: colors,
          },
        };
        if (method === 'edit') await editProduct({ variables });
        else await addProduct({ variables });
        toast('Product has been saved!');
        setTimeout(() => {
          navigate('/admin');
          location.reload();
        }, 1500);
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
          <form
            className="mb-6 w-2/4 h-3/4 bg-orange-200 box-border m-auto p-12 rounded-lg"
            onSubmit={handleSubmit}
          >
            <label
              className="font-bold block mb-1"
              htmlFor="name"
              style={{ display: 'block' }}
            >
              Name
            </label>
            <input
              className="bg-white-50 mb-1 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-white-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-white-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-white-500 dark:focus:border-blue-500"
              id="name"
              placeholder="Enter product name"
              type="text"
              value={values.name}
              onChange={handleChange}
            />
            {errors.name && touched.name ? (
              <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                {errors.name}
              </div>
            ) : null}
            <label
              className="font-bold block mb-1"
              htmlFor="price"
              style={{ display: 'block' }}
            >
              Price
            </label>
            <input
              className="bg-white-50 mb-1 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-white-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-white-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-white-500 dark:focus:border-blue-500"
              id="price"
              placeholder="Enter price ($)"
              type="number"
              value={values.price}
              onChange={handleChange}
            />
            {errors.price && touched.price ? (
              <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                {errors.price}
              </div>
            ) : null}
            <label
              className="font-bold block mb-1"
              htmlFor="stock"
              style={{ display: 'block' }}
            >
              Stock
            </label>
            <input
              className="bg-white-50 mb-1 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-white-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-white-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-white-500 dark:focus:border-blue-500"
              id="stock"
              placeholder="Enter stock"
              type="number"
              value={values.stock}
              onChange={handleChange}
            />
            {errors.stock && touched.stock ? (
              <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                {errors.stock}
              </div>
            ) : null}
            <label
              className="font-bold block mb-1"
              htmlFor="color"
              style={{ display: 'block' }}
            >
              Color
            </label>
            <GithubPicker
              onChange={(color, _e) => {
                let tmp = colour;
                if (tmp === '') tmp = initValue.colors;
                setColour(tmp + ',' + hexToName[color.hex]);
                values.colors += ',' + hexToName[color.hex];
              }}
              colors={Object.keys(hexToName)}
            />
            <input
              className="bg-white-50 mb-1 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-white-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-white-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-white-500 dark:focus:border-blue-500"
              id="colors"
              placeholder="Pick a color"
              type="text"
              value={colour === '' ? initValue.colors : colour}
              onChange={(e) => {
                setColour(e.target.value);
                values.colors = e.target.value;
              }}
            />
            {errors.colors && touched.colors ? (
              <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                {errors.colors}
              </div>
            ) : null}
            <label
              className="font-bold block mb-1"
              htmlFor="description"
              style={{ display: 'block' }}
            >
              Description
            </label>
            <input
              className="bg-white-50 mb-1 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-white-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-white-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-white-500 dark:focus:border-blue-500"
              id="description"
              placeholder="Enter short description"
              type="text"
              value={values.description}
              onChange={handleChange}
            />
            {errors.description && touched.description ? (
              <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                {errors.description}
              </div>
            ) : null}
            <label
              className="font-bold block mb-1"
              htmlFor="categories"
              style={{ display: 'block' }}
            >
              Catergories
            </label>
            <input
              className="bg-white-50 mb-1 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-white-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-white-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-white-500 dark:focus:border-blue-500"
              id="categories"
              placeholder="Enter Categories, separated by semicolon"
              type="text"
              value={values.categories}
              onChange={handleChange}
            />
            {errors.categories && touched.categories ? (
              <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                {errors.categories}
              </div>
            ) : null}
            <label
              className="font-bold block mb-1"
              htmlFor="pictures"
              style={{ display: 'block' }}
            >
              Picture
            </label>
            <input
              className="bg-white-50 mb-1 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-white-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-white-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-white-500 dark:focus:border-blue-500"
              id="pictures"
              placeholder="Enter picture URL"
              type="text"
              value={values.pictures}
              onChange={handleChange}
            />
            {errors.pictures && touched.pictures ? (
              <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                {errors.pictures}
              </div>
            ) : null}
            <label
              className="font-bold block mb-1"
              htmlFor="sizes"
              style={{ display: 'block' }}
            >
              Size
            </label>
            <input
              className="bg-white-50 mb-1 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-white-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-white-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-white-500 dark:focus:border-blue-500"
              id="sizes"
              placeholder="Enter size"
              type="text"
              value={values.sizes}
              onChange={handleChange}
            />
            {errors.sizes && touched.sizes ? (
              <div className="mt-2 text-sm text-red-600 dark:text-red-500">
                {errors.sizes}
              </div>
            ) : null}
            <label
              className="font-bold block mb-1"
              htmlFor="featuringFrom"
              style={{ display: 'block' }}
            >
              Featuring From
            </label>
            <input
              className="bg-white-50 mb-1 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-white-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-white-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-white-500 dark:focus:border-blue-500"
              id="featuringFrom"
              type="date"
              value={values.featuringFrom}
              onChange={handleChange}
            />
            {/* <DatePicker
              onChange={handleChange}
              date={values.featuringFrom}
              mode="date"
              format="DD-MM-YYYY"
            /> */}
            <label
              className="font-bold block mb-1"
              htmlFor="featuringFrom"
              style={{ display: 'block' }}
            >
              Featuring To
            </label>
            <input
              className="bg-white-50 mb-1 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-white-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-white-600 dark:placeholder-gray-400 dark:text-blackblack dark:focus:ring-white-500 dark:focus:border-blue-500"
              id="featuringTo"
              type="date"
              value={values.featuringTo}
              onChange={handleChange}
            />
            <button
              className="mt-4 p-12 inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-indigo-200 rounded-lg hover:bg-indigo-500 focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800
            "
              type="submit"
              disabled={isSubmitting}
            >
              Submit
            </button>
            <ToastContainer />
          </form>
        );
      }}
    </Formik>
  );
};

export default ProductForm;
