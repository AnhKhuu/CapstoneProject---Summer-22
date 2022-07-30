import { gql } from '@apollo/client';

const GET_CART_ITEMS = gql`
  query Customer($customerCustomerId2: ID!) {
    customer(customerId: $customerCustomerId2) {
      id
      items {
        productId
        color
        size
        quantity
      }
      name
      location
    }
  }
`;

const GET_PRODUCT_CART_ITEMS = gql`
  query Product($productId: ID!) {
    product(id: $productId) {
      name
      price
      stock
      colors {
        name
        hexValue
      }
      pictures
      sizes
      id
    }
  }
`;

const GET_FEE = gql`
  query Query($location: String!) {
    fee(location: $location) {
      shipping
      tax
    }
  }
`;

const GET_CUSTOMER = gql`
  query Query($customerId: ID!) {
    customer(customerId: $customerId) {
      id
      items {
        productId
        color
        size
        quantity
      }
    }
  }
`;
export { GET_CART_ITEMS, GET_PRODUCT_CART_ITEMS, GET_FEE, GET_CUSTOMER };
