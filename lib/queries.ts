import { gql } from "@apollo/client";

export const FETCH_USERS = gql`
  query getUsers {
    users {
      id
      age
      email
      first_name
      last_name
      active
      profile
    }
  }
`;

export const CREATE_USER = gql`
  mutation createUser($input: UserInput!) {
    createUser(input: $input) {
      active
      age
      email
      first_name
      id
      last_name
      profile
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      active
      age
      email
      id
      first_name
      last_name
      profile
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;
