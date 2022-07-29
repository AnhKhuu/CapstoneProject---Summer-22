import { gql } from '@apollo/client';

const GET_PRODUCTS = gql`
  query getproduct {
    products {
      name
      price
      stock
      pictures
      sizes
      colors {
        name
      }
      id
    }
  }
`;

const GET_PRODUCT = gql`
  query Query($productId: ID!) {
    product(id: $productId) {
      id
      name
      price
      stock
      sizes
      pictures
      featuringTo
      featuringFrom
      description
      colors {
        name
        hexValue
      }
      categories
    }
  }
`;
export { GET_PRODUCTS, GET_PRODUCT };
