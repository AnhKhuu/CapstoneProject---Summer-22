import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CATEGORIES } from '../../graphql/queries';
import { data } from 'autoprefixer';

const prices = [
  {
    id: 1,
    name: 'Less than 1000',
    value: 'lt1000',
  },
  {
    id: 2,
    name: 'From 1000 to 1500',
    value: 'btw10001500',
  },
  {
    id: 3,
    name: 'Greater than 1500',
    value: 'gt1500',
  },
  {
    id: 4,
    name: 'Clear Filters',
    value: 'clear',
  },
];

const Filters = ({
  activeCategory,
  setActiveCategory,
  activePrice,
  setActivePrice,
  products,
  setFilters,
}) => {
  useEffect(() => {
    if (activeCategory === 'All' && activePrice === '') {
      setFilters(products);
      return;
    }
    const { loading, error, data } = useQuery(GET_CATEGORIES);
    console.log(data);
    if (loading) return <div> Loading... </div>;
    if (error) return <div> Something went wrong </div>;

    const filterCategory = products.filter((item) =>
      activeCategory === 'All' ? item : item.categories == activeCategory
    );

    const filterPrice = filterCategory.filter((item) =>
      activePrice === ''
        ? item
        : activePrice === 'lt1000'
        ? item.price < 1000
        : activePrice === 'btw10001500'
        ? item.price >= 1000 && item.price <= 1500
        : item.price > 1500
    );

    setFilters(filterPrice);
  }, [activeCategory, activePrice, products, setFilters]);
  return (
    <div>
      <div className="ml-3">
        <h1 className="text-2xl tracking-tight text-gray-900">Categories</h1>
        {data.products.map((item) => (
          <button
            onClick={() => setActiveCategory(item.name)}
            key={item.id}
            className={`flex mb-1 font-medium text-gray-900 px-2 py-3 ${
              activeCategory === item.name &&
              'font-medium text-orange-400 px-2 py-3'
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>
      <div className="ml-3">
        <h1 className=" text-2xl tracking-tight text-gray-900">Price</h1>
        {prices.map((item) => (
          <button
            key={item.id}
            onClick={() =>
              item.value !== 'clear'
                ? setActivePrice(item.value)
                : setActivePrice('')
            }
            className={`flex mb-4 font-medium text-gray-900 px-2 py-3 ${
              activePrice === item.value &&
              'font-medium text-orange-400 px-2 py-3'
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Filters;
