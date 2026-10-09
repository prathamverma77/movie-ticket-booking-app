import mongoose, { Schema } from "mongoose";

export interface IShow {
    movie: string;
    showDateTime: Date;
    showPrice: number;
    occupiedSeats: Record<string, any>;
}

const showSchema = new Schema<IShow>(
    {
        movie: { type: String, required: true, ref: 'Movie' },
        showDateTime: { type: Date, required: true },
        showPrice: { type: Number, required: true },
        occupiedSeats: { type: Schema.Types.Mixed, default: {} }
    },
    { minimize: false }
);

const Show = mongoose.model<IShow>("Show", showSchema);
export default Show;
