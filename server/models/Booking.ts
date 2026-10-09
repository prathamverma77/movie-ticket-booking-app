import mongoose, { Schema } from 'mongoose';

export interface IBooking {
    user: string;
    show: string;
    amount: number;
    bookedSeats: any[];
    isPaid: boolean;
    paymentLink?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const bookingSchema = new Schema<IBooking>(
    {
        user: { type: String, required: true, ref: 'User' },
        show: { type: String, required: true, ref: 'Show' },
        amount: { type: Number, required: true },
        bookedSeats: [Schema.Types.Mixed],
        isPaid: { type: Boolean, default: false },
        paymentLink: { type: String },
    },
    { timestamps: true }
);

const Booking = mongoose.model<IBooking>("Booking", bookingSchema);

export default Booking;
