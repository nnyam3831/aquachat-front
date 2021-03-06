import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ApolloProvider } from "react-apollo";
import apolloClient from "./apollo";
ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
