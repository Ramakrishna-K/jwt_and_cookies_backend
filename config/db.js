import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://katravathramakrishna9_db_user:KD1ovYqGusbdvWkH@cluster0.nricadn.mongodb.net/?appName=Cluster0");

    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.log("DB Error ❌", error);
    process.exit(1);
  }
};

export default connectDB;