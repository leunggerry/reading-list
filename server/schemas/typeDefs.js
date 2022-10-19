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
    bookId: String
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
    bookId: String
    authors: [String]
    description: String!
    title: String!
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
