const path = require("path");
const express = require("express");
//Import Apollo
const { ApolloServer } = require("apollo-server-express");

//import middleware
const { authMiddleware } = require("./utils/auth");

//import typeDefs and resolvers
const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");
const { start } = require("repl");
// const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3001;
// create a new Apollo server and pass in the schema data
// provide the typeDefs and resolvers so they know what the API looks like
// and how to resolve requests
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware, // used to set be used for the HTTP request headers and see only headers
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Create a new instance of an Apollo server with GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  // start the server and wait
  await server.start();
  //integrate Apollo Server with Express application as middleware
  server.applyMiddleware({ app });

  //set up static assets
  // check if NodeEnv in in Production mode
  // if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/build")));
  }

  // set the functionality we created a wildcard GET route for the server.
  // if we make a GET requeest to any location on the server that doesn't have an explicit route defined,
  // respond with the production ready React front-end code
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
};

// call the asyn funct to start the server
startApolloServer(typeDefs, resolvers);
