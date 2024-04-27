import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export const DbConnect = async () => {
  try {
    const connectionInstace = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    // console.log("dbInstace: ", dbInstace);
    console.log(
      `\n MongoDB connected !! DB HOST : ${connectionInstace.connection.host}`
    );
  } catch (error) {
    console.log("Mongodb connection error: ", error);
    process.exit(1);
  }
};
