import mongoose, { Schema } from "mongoose";
import { IAdmin } from "@/types";

const AdminSchema = new Schema<IAdmin>({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: false,
        trim: true
    }
},{ timestamps: true });

export default mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);