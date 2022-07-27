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

const DELETE_PRODUCT = gql`
  mutation RemoveProduct($removeProductId: ID!) {
    removeProduct(id: $removeProductId) {
      id
    }
  }
`;

export { GET_PRODUCT, DELETE_PRODUCT };
// export default GET_PRODUCT;
