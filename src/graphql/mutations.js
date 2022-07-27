import { gql } from '@apollo/client';

const ADD_PRODUCT = gql`
  mutation Mutation($product: AddProductInput!) {
    addProduct(product: $product) {
      id
    }
  }
`;

export { ADD_PRODUCT };
