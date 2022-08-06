import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../../layout/MainLayout';
import { useStore } from '../../store/hooks';
import { addToCart } from '../../store/actions';
import { useMutation, useQuery } from '@apollo/client';
import { GET_PRODUCT } from '../../graphql/queries';
import { ThirteenMp } from '@mui/icons-material';
import { color } from '@mui/system';
const Images = ({ url, pictures }) => {
  console.log(url);
  const Image = pictures[0 + url];
  return (
    <div className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden">
      <img
        alt="img-tag-one"
        className="w-full h-full object-center object-cover"
        src={Image}
      ></img>
      ;
    </div>
  );
};
const Option = ({ url, sizes, setActiveSize }) => {
  console.log(url);
  const Size = sizes[0 + url];
  return (
    <div className=" mb-1 font-medium text-gray-900 px-2 py-3 ">
      <button
        onClick={() => setActiveSize(Size)}
        className="text-gray-500 rounded-lg  hover:text-red-600 visited:text-black visited:font-bold"
      >
        {Size}
      </button>
      ;
    </div>
  );
};
const ColorOption = ({ url, colors, setActiveColor }) => {
  console.log(url);
  const Color = colors[0 + url];
  return (
    <div className=" mb-1 font-medium text-gray-900 px-2 py-3 ">
      <button
        onClick={() => setActiveColor(Color)}
        className="text-gray-500 rounded-lg  hover:text-red-600 visited:text-black visited:font-bold"
      >
        {Color.name}
      </button>
      ;
    </div>
  );
};

const ProductProperty = () => {
  const { productId } = useParams();
  const [state, dispatch] = useStore();
  const [activeColor, setActiveColor] = useState();
  const [activeSize, setActiveSize] = useState();
  const ID = productId;
  console.log(ID);
  // const [getProduct, { error, data, loading }] = useQuery(GET_PRODUCT, {
  //   variables: { productId: ID },
  // });
  const index = 1;
  const { loading, error, data } = useQuery(GET_PRODUCT, {
    variables: {
      productId: ID,
    },
  });
  console.log(data);
  if (loading) return <div> Loading... </div>;
  if (error) return <div> Something went wrong </div>;
  const handleAddToCart = (product) => {
    if (
      (product.sizes.length > 1 || product.colors.length > 1) &&
      (activeSize === undefined || activeColor === undefined)
    ) {
      alert('Please select size and color');
    }
    var obj = {
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      colors: activeColor,
      sizes: activeSize,
      description: product.description,
      categories: product.categories,
      pictures: product.pictures,
      featuringFrom: product.featuringFrom,
      featuringTo: product.featuringTo,
    };
    dispatch(addToCart(obj));
  };

  // eslint-disable-next-line react/no-direct-mutation-state
  return (
    <MainLayout>
      <div className="md:flex items-start justify-center py-12 2xl:px-20 md:px-6 px-4">
        <div className="xl:w-2/6 lg:w-2/5 w-80 md:block ">
          {data.product.pictures.map((index, pictures) => (
            <Images
              key={index++}
              url={pictures}
              pictures={data.product.pictures}
            />
          ))}
        </div>
        <div className="xl:w-2/5 md:w-1/2 lg:ml-8 md:ml-6 md:mt-0 mt-6">
          <div className="border-b border-gray-200 pb-6">
            <h1 className="lg:text-2xl text-xl font-semibold lg:leading-6leading-7 text-gray-800 mt-2">
              {data.product.name}
            </h1>
          </div>
          <div className="py-4 border-b border-gray-200 flex items-center justify-between">
            <p className="text-sm leading-none text-gray-600 mr-3">
              {' '}
              {data.product.description}
            </p>
          </div>
          <div className="py-4 border-b border-gray-200 flex items-center justify-between">
            <p className="text-base leading-4 text-gray-800">Category</p>
            <div className="flex items-center justify-center">
              <p className="text-sm leading-none text-gray-600 mr-3">
                {data.product.categories}
              </p>
            </div>
          </div>
          <div className="py-4 border-b border-gray-200 flex items-center justify-between">
            <p className="text-base leading-4 text-gray-800">Size</p>
            <div className="flex items-center justify-center">
              <div className="flex-row	bg-gradient-to from-gray-900 to-indigo-500 ml-3 mr-4 cursor-pointer">
                {data.product.sizes.map((index, sizes) => (
                  <Option
                    key={index++}
                    url={sizes}
                    sizes={data.product.sizes}
                    setActiveSize={setActiveSize}
                  />
                ))}{' '}
              </div>
            </div>
          </div>
          <div className="py-4 border-b border-gray-200 flex items-center justify-between">
            <p className="text-base leading-4 text-gray-800">Color</p>
            <div className="flex items-center justify-center">
              <div className="flex-row	bg-gradient-to from-gray-900 to-indigo-500 ml-3 mr-4 cursor-pointer">
                {data.product.colors.map((index, colors) => (
                  <ColorOption
                    key={index++}
                    url={colors}
                    colors={data.product.colors}
                    setActiveColor={setActiveColor}
                  />
                ))}{' '}
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <h1 className="lg:text-2xl text-xl font-semibold lg:leading-6leading-7 text-gray-800 mt-2">
              ${data.product.price}
            </h1>
          </div>
          <button
            onClick={() => handleAddToCart(data.product)}
            className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800
						text-base flex items-center justify-center leading-none text-white bg-gray-800 w-full py-4 hover:bg-gray-700"
          >
            <svg
              className="mr-3"
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            ></svg>
            Add to cart
          </button>
        </div>
      </div>
    </MainLayout>
  );
};
export default ProductProperty;
