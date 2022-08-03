import { gql } from '@apollo/client';

const GET_PRODUCTS = gql`
  query Query {
    products {
      id
      name
      price
      stock
      colors {
        name
        hexValue
      }
      description
      categories
      pictures
      sizes
      featuringFrom
      featuringTo
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
      name
      location
    }
  }
`;

const GET_PRODUCT = gql`
  query Product($productId: ID!) {
    product(id: $productId) {
      id
      name
      price
      stock
      colors {
        name
        hexValue
      }
      description
      categories
      pictures
      sizes
      featuringFrom
      featuringTo
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
const GET_CATEGORIES = gql`
  query Query {
    products {
      id
      categories
    }
  }
`;

export { GET_PRODUCT, GET_FEE, GET_CUSTOMER, GET_PRODUCTS, GET_CATEGORIES };
