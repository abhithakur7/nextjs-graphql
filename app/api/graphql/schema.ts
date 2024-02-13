const typeDefs = `#graphql
    type User {
        id: ID!
        first_name: String!
        last_name: String!
        email: String!
        age: Int!
        active: Boolean
        profile: String!
    }

    input UserInput {
        first_name: String!
        last_name: String!
        email: String!
        age: Int!
        profile: String!
    }

    input UpdateUserInput {
        id: ID!
        first_name: String
        last_name: String
        email: String
        age: Int
        active: Boolean
        profile: String!
  }

    type Query {
        users: [User]
    }

    type Mutation {
        createUser(input: UserInput!): User
        updateUser(input: UpdateUserInput!): User
        deleteUser(id:ID!): String
    }
`;

export default typeDefs;
