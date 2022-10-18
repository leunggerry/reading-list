/**
 * Import require libs
 */
const { User } = require("../models");
/**
 * Connect Query or Mutation type def that performs a CRUB action
 * that each query or mutation is expedted to perform
 */
const resolvers = {
  Query: {
    // get all users
    users: async () => {
      return User.find().select("-__v -password").populate("savedBooks");
    },

    // get a single user
    user: async (parent, { username }) => {
      return User.findOne({ username }).select("-__v -password").populate("savedBooks");
    },
  },
  //Mutations
  Mutation: {
    addUser: async (parent, args) => {
      //Create User in Mongos in the DB give the args in the parms
      const user = await User.create(args);

      //add authentication

      return user;
    },
  },
};

module.exports = resolvers;
