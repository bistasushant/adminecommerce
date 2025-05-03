import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

const SECRET = process.env.JWT_SECRET || "secret";

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
};
export const comparePassword = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash);
};
export const generateToken = (email: string) => {
    return jwt.sign({ email }, SECRET   );
  };

export const getToken = (req: NextRequest) => {
    const authHeader = req.headers.get('authorization');
    if(!authHeader || !authHeader.startsWith("Bearer")) {
        return null;
    }
    return authHeader.split(' ')[1];
};
