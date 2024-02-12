const resolvers = {
  Query: {
    users: async (
      _: any,
      __: any,
      context: { dataSources?: { users: { getAllUsers: () => any } } }
    ) => {
      try {
        if (context.dataSources) {
          return await context.dataSources.users.getAllUsers();
        }
      } catch (error) {
        throw new Error("Failed to fetch user");
      }
    },
  },
  Mutation: {
    createUser: async (
      _: any,
      { input }: any,
      context: { dataSources?: { users: { createUser: (input: any) => any } } }
    ) => {
      try {
        if (context.dataSources) {
          const newUser = await context.dataSources.users.createUser({ input });
          return newUser;
        }
      } catch (error) {
        throw new Error("Failed to create user");
      }
    },

    updateUser: async (
      _: any,
      { input }: any,
      context: { dataSources?: { users: { updateUser: (input: any) => any } } }
    ) => {
      try {
        if (context.dataSources) {
          const updatedUser = await context.dataSources.users.updateUser({
            input,
          });
          return updatedUser;
        }
      } catch (error) {
        throw new Error("Failed to update user");
      }
    },

    deleteUser: async (
      _: any,
      { id }: any,
      context: { dataSources?: { users: { deleteUser: (id: any) => any } } }
    ) => {
      try {
        if (context.dataSources) {
          await context.dataSources.users.deleteUser({ id });
          return "User successfully deleted";
        }
      } catch (error) {
        throw new Error("Failed to delete user");
      }
    },
  },
};

export default resolvers;
