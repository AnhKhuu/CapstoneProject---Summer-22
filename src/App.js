import Router from './route';
import React from 'react';
import './App.css';
/*import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});*/

const App = () => {
  return (
    /*<ApolloProvider client={client}>
      <Router />
    </ApolloProvider>*/
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
    </div>
  );
};
export default App;
