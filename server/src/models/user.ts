import mongoose from 'mongoose';
import { IUser, RoleType } from './iUser';

const Schema = mongoose.Schema;

const userScheme = new Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: { type: String },
    role: { type: String, enum: Object.values(RoleType), default: 'user' },
});
export default mongoose.model<IUser>('User', userScheme);
