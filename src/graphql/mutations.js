import { gql } from '@apollo/client';

const ADD_PRODUCT = gql`
  mutation Mutation($product: AddProductInput!) {
    addProduct(product: $product) {
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

export { ADD_PRODUCT, DELETE_PRODUCT };
