/**
 * Import require libs
 */
const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
//import signed token
const { signToken } = require("../utils/auth");
/**
 * Connect Query or Mutation type def that performs a CRUB action
 * that each query or mutation is expedted to perform
 */
const resolvers = {
  Query: {
    //query for the user that logged in
    // headers are passed in the context and there is a user arg
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate("savedBooks");

        return userData;
      }

      //if not context user throw error
      throw new AuthenticationError("Not Logged in");
    },
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

      //create a token for the user
      const token = signToken(user);

      //return Auth type
      return { token, user };
    },

    login: async (parent, { email, password }) => {
      //find a user by their email
      const user = await User.findOne({ email });

      //if not user is found
      if (!user) {
        throw new AuthenticationError("Incorect Credentials");
      }

      //check the password
      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect Credentials");
      }

      const token = signToken(user);
      return { token, user };
    },

    // book mutations
    saveBook: async (parent, { input }, context) => {
      //check if user is logged in
      if (context.user) {
        const updatedUser = User.findOneAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: input } },
          { new: true }
        );

        return updatedUser;
      }
      throw new AuthenticationError("You need to be logged in!");
    },

    //remove book
    removeBook: async (parent, { bookId }, context) => {
      //check if user is logged in
      if (context.user) {
        const updatedUser = User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: {bookId: bookId} } },
          { new: true }
        );

        return updatedUser;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;
