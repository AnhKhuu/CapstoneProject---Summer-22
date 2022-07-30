import { gql } from '@apollo/client';

const ADD_PRODUCT = gql`
  mutation Mutation($product: AddProductInput!) {
    addProduct(product: $product) {
      id
    }
  }
`;

const UPDATE_CART = gql`
  mutation Mutation($customer: CustomerInput!) {
    updateCustomer(customer: $customer) {
      id
    }
  }
`;

const UPDATE_CUSTOMER = gql`
  mutation Mutation($customer: CustomerInput!) {
    updateCustomer(customer: $customer) {
      id
    }
  }
`;

const UPDATE_STOCK = gql`
  mutation Mutation($product: UpdateProductInput!) {
    updateProduct(product: $product) {
      id
    }
  }
`;

const EMPTY_CART = gql`
  mutation Mutation($emptyCartCustomerId2: ID!) {
    emptyCart(customerId: $emptyCartCustomerId2) {
      id
    }
  }
`;

export { ADD_PRODUCT, UPDATE_CART, UPDATE_CUSTOMER, UPDATE_STOCK, EMPTY_CART };
