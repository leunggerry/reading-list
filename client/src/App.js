import React from "react";
/**
 * ApolloProvider is a special type of React component that we'll use to provide data to all of the other components.
 *
 * ApolloClient is a constructor function that will help initialize the connection to the GraphQL API server.
 *
 * InMemoryCache enables the Apollo Client instance to cache API response data so that we can perform requests more efficiently.
 *
 * createHttpLink allows us to control how the Apollo Client makes a request. Think of it like middleware for the outbound network requests.
 */
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SearchBooks from "./pages/SearchBooks";
import SavedBooks from "./pages/SavedBooks";
import Navbar from "./components/Navbar";
//import context for middleware functino that will retrieve the token and combine it with existing httpLink
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "/graphql",
});

//retreive token and combine it right after the htttpLink
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    // pass the client variable as the value for the client prop
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Switch>
            <Route exact path="/" component={SearchBooks} />
            <Route exact path="/saved" component={SavedBooks} />
            <Route render={() => <h1 className="display-2">Wrong page!</h1>} />
          </Switch>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
