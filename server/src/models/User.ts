import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import { Role } from "@appliences/shared";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: Role;
  isApproved: boolean;
  refreshToken: string | null;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: Object.values(Role), default: Role.USER },
    isApproved: { type: Boolean, default: true },
    refreshToken: { type: String, default: null },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

userSchema.set("toJSON", {
  transform(_doc, ret) {
    delete ret.password;
    delete ret.refreshToken;
    delete ret.__v;
    return ret;
  },
});

export const UserModel = mongoose.model<IUser>("User", userSchema);
