import mongoose, { Schema } from 'mongoose';

export interface IUser {
    _id: string;
    name: string;
    email: string;
    image: string;
}

const userSchema = new Schema<IUser>({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
}, { _id: false });

const User = mongoose.model<IUser>('User', userSchema);

export default User;
