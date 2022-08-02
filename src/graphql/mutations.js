import { gql } from '@apollo/client';

const UPDATE_CUSTOMER = gql`
  mutation Mutation($customer: CustomerInput!) {
    updateCustomer(customer: $customer) {
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

const UPDATE_PRODUCT = gql`
  mutation Mutation($product: UpdateProductInput!) {
    updateProduct(product: $product) {
      id
    }
  }
`;

const EMPTY_CART = gql`
  mutation Mutation($customerId: ID!) {
    emptyCart(customerId: $customerId) {
      id
    }
  }
`;

export { UPDATE_PRODUCT, UPDATE_CUSTOMER, EMPTY_CART, ADD_PRODUCT, DELETE_PRODUCT, EDIT_PRODUCT };
