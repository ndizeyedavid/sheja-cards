import mongoose from "mongoose";
import dotenv from "dotenv";
import { env } from "./env";
dotenv.config();

const connectDB = async () => {
  try {
    const MONGO_URI = env.MONGO_URI;

    await mongoose.connect(MONGO_URI);
    console.log("\nDatabase connected successfully");
  } catch (err: any) {
    console.error("\nFailed to connect to DB. ERROR: ", err);
    process.exit(1);
  }
};

export default connectDB;
