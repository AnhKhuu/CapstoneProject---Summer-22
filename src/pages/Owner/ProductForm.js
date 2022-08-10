import React, { useState } from 'react';
import { Formik } from 'formik';
import { ADD_PRODUCT, EDIT_PRODUCT } from '../../graphql/mutations';
import { useMutation, useQuery } from '@apollo/client';
import 'react-datepicker/dist/react-datepicker.css';
import { GET_PRODUCT } from '../../graphql/queries';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ntc from './Ntcolor';

//Default sizes
const defaultSizeOptions = [
  { value: 'XXS', label: 'XXS' },
  { value: 'XS', label: 'XS' },
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
  { value: 'XXL', label: 'XXL' },
];

// Add/edit product form
const ProductForm = () => {
  const [addProduct, { data, loading, errors }] = useMutation(ADD_PRODUCT, {
    variables: {},
  });
  const [editProduct] = useMutation(EDIT_PRODUCT, {
    variables: {},
  });
  const [colour, setColour] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [_, setDisplaySelect] = useState(false);
  const [displayInput, setDisplayInput] = useState(false);
  const [inputPicture, setInputPicture] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [__, setEndDate] = useState('');
  const [size, setSize] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const { pid } = useParams();
  const navigate = useNavigate();
  const res = useQuery(GET_PRODUCT, { variables: { productId: pid || '' } });
  if (res.loading) return <div> Loading... </div>;
  const method = pid ? 'edit' : 'new';
  let myColour = '';
  let originalStartDate = '';

  // sNormalizeData
  const normalizeData = (product) => {
    console.log(product);
    const colors = product.colors.map((c) => c.name).join(',');
    const selectedColor =
      method == 'edit' ? product.colors.map((c) => c.hexValue).join(',') : '';
    const categories =
      product.categories == [''] ? '' : product.categories.join(';');
    let pictureURLs = '';
    if (product.pictures.length == 1) {
      pictureURLs = product.pictures[0];
    } else {
      pictureURLs = product.pictures == [] ? '' : product.pictures.join(';');
    }
    originalStartDate = product.featuringFrom;
    return {
      id: product.id,
      colors: colors,
      selectedColor: selectedColor,
      pictures: pictureURLs,
      sizes: product.sizes.join(','),
      categories: categories,
      price: product.price,
      stock: product.stock,
      name: product.name,
      description: product.description,
      featuringFrom: product.featuringFrom,
      featuringTo: product.featuringTo,
    };
  };

  // sValidate
  const validate = (values) => {
    const errors = {};

    let regExpName = /[a-zA-Z]/g;
    if (!values.name) {
      errors.name = 'Name is required';
    } else if (values.name.length > 144) {
      errors.name = 'Name must be less than 144 characters';
    } else if (values.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    } else if (!regExpName.test(values.name)) {
      errors.name = 'Name must have at least 1 characters';
    }

    if (!values.price) {
      errors.price = 'Price is required';
    } else if (values.price < 0) {
      errors.price = 'Price must be positive';
    }

    if (!values.stock) {
      errors.stock = 'Stock is required';
    } else if (values.stock < 0) {
      errors.stock = 'Stock must be positive';
    }

    if (!values.colors) {
      errors.colors = 'Color is required';
    }

    if (values.description.length > 1000) {
      errors.description = 'Description must be less than 1000 characters';
    } else if (values.name.length < 2) {
      errors.description = 'Description must be at least 2 characters';
    }

    if (values.featuringFrom != '' && values.featuringTo != '') {
      if (values.featuringFrom != originalStartDate) {
        if (values.featuringFrom && values.featuringFrom < Date.now()) {
          errors.featuringFrom = 'Date should be at least from today';
        }
        if (values.featuringTo && values.featuringTo <= values.featuringFrom) {
          errors.featuringTo = 'Date should be later than featuring from date';
        }
        if (values.featuringFrom < today) {
          errors.featuringFrom = 'Date should be at least from today';
        }
      }
    }

    return errors;
  };

  const originalValue =
    method == 'edit' ? normalizeData(res.data.product) : null;

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
  let rowSizeValue = [];
  for (let index = 0; index < defaultSizeOptions.length; index++) {
    rowSizeValue.push(
      <option
        value={defaultSizeOptions[index]['value']}
        label={defaultSizeOptions[index]['label']}
      />
    );
  }
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd;
  return (
    <Formik
      initialValues={initValue}
      validate={validate}
      onSubmit={async (product, e) => {
        e.preventDefault = true;
        console.log('initValue.selectedColor:');
        console.log(initValue.selectedColor);
        console.log('colour: ' + colour);
        const colors = (colour === '' ? initValue.selectedColor : colour)
          .split(',')
          .map((c) => ({
            name: ntc.name(c)[1],
            hexValue: c,
          }))
          .filter((c) => c.name && c.hexValue);
        let pictures = product.pictures;
        if (inputPicture !== null) {
          console.log('inputPicture :' + inputPicture);
          pictures += ';' + inputPicture;
        }
        let compareColor = colors.map((c) => c.hexValue).join(',');
        pictures = pictures.replace(/ /g, '');
        const categoriesTrim = product.categories.replace(/ /g, '').split(';');
        const sizeTrim = size.replace(/ /g, '').split(',');
        console.log('pictures');
        console.log(pictures);
        if (method == 'new') {
          const variables = {
            product: {
              ...product,
              price: product.price,
              stock: product.stock,
              categories: categoriesTrim,
              pictures: pictures.split(';'),
              sizes: sizeTrim,
              colors: colors,
            },
          };
          console.log(variables);

          await addProduct({ variables });
          toast('Product has been added!');
          setTimeout(() => {
            navigate('/admin');
            location.reload();
          }, 1500);
        } else {
          const variables = {
            product: {},
          };
          variables.product['id'] = product.id;

          if (product.name != originalValue.name) {
            variables.product['name'] = product.name;
          }
          if (product.price != originalValue.price) {
            variables.product['price'] = product.price;
          }
          if (product.stock != originalValue.stock) {
            variables.product['stock'] = product.stock;
          }
          if (product.price != originalValue.price) {
            variables.product['price'] = product.price;
          }
          if (product.description != originalValue.description) {
            variables.product['description'] = product.description;
          }
          if (categoriesTrim != originalValue.categories) {
            variables.product['categories'] = categoriesTrim;
          }
          if (pictures != originalValue.pictures) {
            variables.product['pictures'] = pictures.split(';');
          }
          if (compareColor != originalValue.selectedColor) {
            variables.product['colors'] = colors;
          }
          if (sizeTrim != originalValue.sizes) {
            variables.product['sizes'] = sizeTrim;
          }
          // console.log(formattedDate(product.featuringFrom));
          if (product.featuringFrom != originalValue.featuringFrom) {
            variables.product['featuringFrom'] = product.featuringFrom;
          }
          if (product.featuringTo != originalValue.featuringTo) {
            variables.product['featuringTo'] = product.featuringTo;
          }
          console.log(variables);
          await editProduct({ variables });
          toast('Product has been saved!');
          setTimeout(() => {
            navigate('/admin');
            location.reload();
          }, 1500);
        }
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
            className="mb-6 w-2/4 h-3/4 bg-green-100 rounded border border-gray-200 m-auto p-14 rounded-lg grid hover:bg-green-200"
            onSubmit={handleSubmit}
          >
            <label
              className="font-bold block mb-1"
              htmlFor="name"
              style={{ display: 'block' }}
            >
              Name (*)
            </label>
            <input
              className="mt-2 mb-2 bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
              id="name"
              placeholder="Enter product name"
              type="text"
              // pattern="^\d*[a-zA-Z][a-za-Z0-9]*$"
              value={values.name}
              onChange={handleChange}
            />
            {errors.name && touched.name ? (
              <div className="mt-2 mb-2 text-sm text-red-600 dark:text-red-500">
                {errors.name}
              </div>
            ) : null}
            <label
              className="font-bold block mb-1"
              htmlFor="price"
              style={{ display: 'block' }}
            >
              Price (*)
            </label>
            <input
              className="mt-2 mb-2 bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
              id="price"
              placeholder="Enter price ($)"
              type="number"
              value={values.price}
              onChange={handleChange}
            />
            {errors.price && touched.price ? (
              <div className="mt-2 mb-2 text-sm text-red-600 dark:text-red-500">
                {errors.price}
              </div>
            ) : null}
            <label
              className="font-bold block mb-1"
              htmlFor="stock"
              style={{ display: 'block' }}
            >
              Stock (*)
            </label>
            <input
              className="mt-2 mb-2 bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
              id="stock"
              placeholder="Enter stock"
              type="number"
              value={values.stock}
              onChange={handleChange}
            />
            {errors.stock && touched.stock ? (
              <div className="mt-2 mb-2 text-sm text-red-600 dark:text-red-500">
                {errors.stock}
              </div>
            ) : null}
            <label
              className="font-bold block mb-1"
              htmlFor="color"
              style={{ display: 'block' }}
            >
              Color (*)
            </label>

            <input
              id="colors"
              className="-mt-22 -mb-2"
              placeholder="Pick a color"
              type="color"
              onChange={(e) => {
                console.log('picker color: ' + e.target.value);
                setSelectedColor(e.target.value);
              }}
            />
            <br></br>

            <button
              className="border-2 rounded-lg px-3 py-1 mr-4 mt-2 mb-2 bg-orange-100 text-{#927f75} shadow-sm"
              onClick={(e) => {
                e.preventDefault();
                if (values.colors.length > 0) {
                  values.colors += ', ' + ntc.name(selectedColor)[1];
                  myColour =
                    (values.selectedColor == '' ||
                    values.selectedColor == undefined
                      ? ''
                      : values.selectedColor + ',') +
                    colour +
                    ',' +
                    selectedColor;
                } else {
                  values.colors += ntc.name(selectedColor)[1];
                  myColour = selectedColor;
                }
                setColour(myColour);
                console.log(colour);
              }}
              type="button"
            >
              Add Color...
            </button>

            <input
              className="mt-2 mb-2 bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
              id="colors"
              placeholder="Pick a color"
              type="text"
              value={values.colors}
              onChange={(e) => {
                values.colors = e.target.value;
                if (e.target.value.length == 0) {
                  values.selectedColor = '';
                }
                setDisplaySelect(e.target.value);
              }}
            />
            {errors.colors && touched.colors ? (
              <div className="mt-2 mb-2 text-sm text-red-600 dark:text-red-500">
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
              className="mt-2 mb-2 bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
              id="description"
              placeholder="Enter short description"
              type="text"
              value={values.description}
              onChange={handleChange}
            />
            {errors.description && touched.description ? (
              <div className="mt-2 mb-2 text-sm text-red-600 dark:text-red-500">
                {errors.description}
              </div>
            ) : null}
            <label
              className="font-bold block mb-1"
              htmlFor="categories"
              style={{ display: 'block' }}
            >
              Categories
            </label>
            <input
              className="mt-2 mb-2 bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
              id="categories"
              placeholder="Enter categories, separated by semi-colon"
              type="text"
              value={values.categories}
              onChange={handleChange}
            />
            {errors.categories && touched.categories ? (
              <div className="mt-2 mb-2 text-sm text-red-600 dark:text-red-500">
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
              className="mt-2 mb-2 bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
              id="pictures"
              placeholder="Enter picture URL, separated by semi-colon"
              type="text"
              value={values.pictures}
              onChange={handleChange}
            />
            {errors.pictures && touched.pictures ? (
              <div className="mt-2 mb-2 text-sm text-red-600 dark:text-red-500">
                {errors.pictures}
              </div>
            ) : null}
            {/* Picture Add More */}

            <button
              className="border-2 rounded-lg px-3 py-1 mr-4 mt-2 mb-2 bg-orange-100 text-{#927f75} shadow-sm"
              onClick={(e) => {
                e.preventDefault();
                setDisplayInput(!displayInput);
              }}
            >
              Add More...
            </button>
            {displayInput && (
              <input
                className="mt-2 mb-2 bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                id="morepics"
                placeholder="Enter picture URL"
                type="text"
                value={inputPicture}
                onChange={(e) => setInputPicture(e.target.value)}
              />
            )}
            <label
              className="font-bold block mb-1"
              htmlFor="sizes"
              style={{ display: 'block' }}
            >
              Size
            </label>
            <select
              className="mt-2 mb-2 bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
              name="size"
              value={selectedSize}
              onChange={(e) => {
                setSelectedSize(e.target.value);
              }}
              style={{ display: 'block' }}
            >
              {rowSizeValue}
            </select>
            <button
              className="border-2 rounded-lg px-3 py-1 mr-4 mt-2 mb-2 bg-orange-100 text-{#927f75} shadow-sm"
              onClick={(e) => {
                e.preventDefault();
                console.log('selectedSize: ' + selectedSize);
                if (selectedSize === '') {
                  values.sizes += '';
                  setSize('');
                } else {
                  let arr = values.sizes.split(',');
                  if (arr.includes(selectedSize)) {
                    console.log('duplicate value: ' + selectedSize);
                    return;
                  }
                  if (values.sizes.length > 0) {
                    values.sizes += ',' + selectedSize;
                    setSize(size + ',' + selectedSize);
                  } else {
                    values.sizes += selectedSize;
                    setSize(size + selectedSize);
                  }
                }
              }}
              type="button"
            >
              Add Size...
            </button>
            <input
              className="mt-2 mb-2 bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
              id="sizes"
              placeholder="Enter size"
              type="text"
              value={values.sizes}
              onChange={handleChange}
            />

            {errors.sizes && touched.sizes ? (
              <div className="mt-2 mb-2 text-sm text-red-600 dark:text-red-500">
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
              className="mt-2 mb-2 bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
              type="date"
              name="featureFrom"
              id="featureFrom"
              min={method == 'edit' ? null : today}
              value={values.featuringFrom}
              onChange={(e) => {
                values.featuringFrom = e.target.value;
                setStartDate(e.target.value);
              }}
            ></input>

            {errors.featuringFrom && touched.featuringFrom && (
              <div className="mt-2 mb-2 text-sm text-red-600 dark:text-red-500">
                {errors.featuringFrom}
              </div>
            )}
            <label
              className="font-bold block mb-1"
              htmlFor="featuringFrom"
              style={{ display: 'block' }}
            >
              Featuring To
            </label>

            <input
              className="mt-2 mb-2 bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
              type="date"
              name="featureTo"
              id="featureTo"
              min={startDate}
              value={values.featuringTo}
              onChange={(e) => {
                values.featuringTo = e.target.value;
                setEndDate(e.target.value);
              }}
            ></input>

            {errors.featuringTo && touched.featuringTo ? (
              <div className="mt-2 mb-2 text-sm text-red-600 dark:text-red-500">
                {errors.featuringTo}
              </div>
            ) : null}
            <br></br>
            <button
              className="border-2 rounded-lg px-3 py-1 mr-4 mt-2 mb-2 bg-orange-200 text-{#927f75} font-bold hover:bg-orange-300 shadow-lg
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
