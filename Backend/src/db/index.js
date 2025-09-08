import mongoose, { mongo } from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Mongodb connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Error encountered while connecting to mongoDB: ", error);
  }
};

export { connectDB };
