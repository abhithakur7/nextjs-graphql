import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import mongoose from "mongoose";
import resolvers from "./resolver";
import Users from "./dataSources";
import typeDefs from "./schema";
import UserModel from "./models/user";
import { NextRequest } from "next/server";

const uri = process.env.NEXT_PUBLIC_MONGODB_URI;

const connectDB = async () => {
  try {
    if (uri) {
      await mongoose.connect(uri);
      console.log("🎉 connected to database successfully");
    }
  } catch (error) {
    console.error(error);
  }
};
connectDB();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req, res) => ({
    req,
    res,
    dataSources: {
      users: new Users({ modelOrCollection: UserModel }),
    },
  }),
});

export async function GET(req: NextRequest) {
  return handler(req);
}
export async function POST(req: NextRequest) {
  return handler(req);
}
