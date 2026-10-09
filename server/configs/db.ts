import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    try {
        mongoose.connection.on('connected', () => console.log('Database connected'));
        await mongoose.connect(`${process.env.MONGODB_URI}/movieticket`);
    } catch (error: any) {
        console.log(error.message);
    }
};

export default connectDB;
