/**
 * Import GQL template function
 */
const { gql } = require("apollo-server-express");

/**
 * TypeDefs for the client
 */

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    bookId: ID
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  type Query {
    me: User
    user(username: String!): User
    users: [User]
  }

  input BookInput {
    authors: [String]
    description: String!
    title: String!
    bookId: ID!
    image: String!
    link: String!
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(input: BookInput): User
    removeBook(bookId: ID!): User
  }

  type Auth {
    token: ID!
    user: User
  }
`;

/**
 * Export the TypeDefs
 */
module.exports = typeDefs;
