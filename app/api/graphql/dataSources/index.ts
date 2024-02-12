import { MongoDataSource } from "apollo-datasource-mongodb";
import { ObjectId } from "mongoose";
import UserModel from "../models/user";

interface UserDocument {
  _id: ObjectId;
  username: string;
  password: string;
  email: string;
  interests: [string];
}

export default class Users extends MongoDataSource<UserDocument> {
  async getAllUsers() {
    try {
      return await UserModel.find();
    } catch (error) {
      throw new Error("Failed to fetch users");
    }
  }

  async createUser({ input }: any) {
    try {
      return await UserModel.create({ ...input });
    } catch (error) {
      throw new Error("Failed to create user");
    }
  }

  async updateUser({ input }: any) {
    try {
      return await UserModel.findByIdAndUpdate(input.id, { ...input });
    } catch (error) {
      throw new Error("Failed to update user");
    }
  }

  async deleteUser({ id }: { id: ObjectId }) {
    try {
      return await UserModel.findByIdAndDelete(id);
    } catch (error) {
      throw new Error("Failed to delete user");
    }
  }
}
