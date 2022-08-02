import { gql } from '@apollo/client';

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
  query Query($productId: ID!) {
    product(id: $productId) {
      id
      price
      name
      stock
      colors {
        name
        hexValue
      }
      description
      pictures
      categories
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

export { GET_PRODUCT, GET_FEE, GET_CUSTOMER };
