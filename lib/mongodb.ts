import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "@/models/Admin";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is missing in environment variable");
}

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  await mongoose.connect(MONGODB_URI);

  // Check and create default admin
  const adminCount = await Admin.countDocuments();
  if (adminCount === 0) {
    const hashedPassword = await bcrypt.hash("Admin@123", 10);
    await Admin.create({
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
    });
    console.log("✅ Default admin created: admin@gmail.com / Admin@123");
  }
};
