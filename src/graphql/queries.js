import { gql } from '@apollo/client';

const GET_PRODUCT = gql`
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


export { GET_PRODUCT };
