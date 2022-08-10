import React, { useEffect, useState } from 'react';
import { useDebounce } from '../../store/hooks';

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
  const [searchInput, setSearchInput] = useState('');
  const debounced = useDebounce(searchInput, 500);
  useEffect(() => {
    if (activeCategory === 'All' && activePrice === '') {
      setFilters(products);
      return;
    }

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

  useEffect(() => {
    const getSearchData = async () => {
      if (debounced !== undefined) {
        if (debounced.trim() === '') {
          setFilters(products);
          return;
        }
        setFilters(() =>
          products.filter((product) =>
            product.name.toLowerCase().includes(debounced)
          )
        );
      }
    };
    getSearchData();
  }, [debounced]);

  const handleOnKeyDown = products.filter((item) =>
    searchInput == '' ? item : item.name == searchInput
  );

  const category = [].concat.apply(
    [],
    products.map((item) => item.categories)
  );

  const groupByCategory = new Set(category);
  const arrCategory = Array.from(groupByCategory);

  return (
    <div>
      <div className="ml-3">
        <input
          type="search"
          placeholder="Search here"
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <h1 className="text-2xl tracking-tight text-gray-900">Categories</h1>
        {arrCategory.map((item, index) => (
          <button
            onClick={() => setActiveCategory(item)}
            key={index}
            className={`flex mb-1 font-medium text-gray-900 px-2 py-3 ${
              activeCategory === item && 'font-medium text-orange-400 px-2 py-3'
            }`}
          >
            {item}
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
