import { gql } from '@apollo/client';

const UPDATE_CUSTOMER = gql`
  mutation Mutation($customer: CustomerInput!) {
    updateCustomer(customer: $customer) {
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

export { UPDATE_PRODUCT, UPDATE_CUSTOMER, EMPTY_CART };
