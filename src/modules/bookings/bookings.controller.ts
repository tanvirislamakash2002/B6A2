import { Request, Response } from "express";
import { bookingsServices } from "./booking.service";

const addForBookings = async (req: Request, res: Response) => {
    const result = await bookingsServices.addForBookings(req.body)
    res.status(200).json({
        message: 'data not found',
        data: result
    })
}

const getAllBookings = async (req: Request, res: Response) => {
    const result = await bookingsServices.getAllBookings();
    res.status(200).json({
        success: true,
        data: result

    })
}

export const bookingsControllers = {
    addForBookings,
    getAllBookings
}