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
const EDIT_PRODUCT = gql`
  mutation AddProduct($product: UpdateProductInput!) {
    updateProduct(product: $product) {
      id
    }
  }
`;

export { ADD_PRODUCT, DELETE_PRODUCT, EDIT_PRODUCT };
