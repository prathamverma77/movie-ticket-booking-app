import { Request, Response } from 'express';
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import { AuthRequest } from '../middleware/auth.js';

// Function to check availability of selected seats for a movie
const checkSeatsAvailability = async (showId: string, selectedSeats: string[]): Promise<boolean> => {
    try {
        const showData = await Show.findById(showId);
        if (!showData) return false;

        const occupiedSeats = showData.occupiedSeats || {};
        const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);
        return !isAnySeatTaken;
    } catch (error: any) {
        console.log(error.message);
        return false;        
    }
};

export const createBooking = async (req: Request, res: Response): Promise<any> => {
    try {
        const authReq = req as AuthRequest;
        const { userId } = authReq.auth();
        const { showId, selectedSeats } = req.body;

        // check if the seat is available for the selected show
        const isAvailable = await checkSeatsAvailability(showId, selectedSeats);

        if (!isAvailable) {
            return res.json({ success: false, message: "Selected seats are not available" });
        }

        // get the show details
        const showData = await Show.findById(showId).populate('movie');
        if (!showData) {
            return res.json({ success: false, message: "Show not found" });
        }

        // create a new booking 
        await Booking.create({
            user: userId, 
            show: showId, 
            amount: showData.showPrice * selectedSeats.length,
            bookedSeats: selectedSeats
        });

        selectedSeats.forEach((seat: string) => {
            showData.occupiedSeats[seat] = userId;
        });

        showData.markModified('occupiedSeats');

        await showData.save();

        // stripe gateway initialize

        return res.json({ success: true, message: 'booked successfully' });
    } catch (error: any) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
};

export const getOccupiedSeats = async (req: Request, res: Response): Promise<any> => {
    try {
        const { showId } = req.params;
        const showData = await Show.findById(showId);
        if (!showData) {
            return res.json({ success: false, message: "Show not found" });
        }
        const occupiedSeats = Object.keys(showData.occupiedSeats || {});
        return res.json({ success: true, occupiedSeats });
    } catch (error: any) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
};
