import React, { useContext, useState, useEffect, useRef } from 'react';
import Context from './Context';

export const useStore = () => {
  const [state, dispatch] = useContext(Context);

  return [state, dispatch];
};

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value]);

  return debouncedValue;
};
