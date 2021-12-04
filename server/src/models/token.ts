import mongoose from 'mongoose';
import { IToken } from './iToken';

const Schema = mongoose.Schema;

const tokenScheme = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    refreshToken: { type: String, required: true },
});

export default mongoose.model<IToken>('Token', tokenScheme);
