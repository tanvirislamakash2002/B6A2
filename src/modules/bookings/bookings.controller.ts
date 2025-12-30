import { Request, Response } from "express";
import { bookingsServices } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";

const addForBookings = async (req: Request, res: Response) => {
    const result = await bookingsServices.addForBookings(req.body)
    res.status(200).json({
        message: 'data not found',
        data: result
    })
}

const getAllBookings = async (req: Request, res: Response) => {
    const result = await bookingsServices.getAllBookings(req.user as JwtPayload);
    res.status(200).json({
        success: true,
        data: result.rows,
        user: req.user

    })
}

const updateAvailabilityStatus = async (req: Request, res: Response) => {
    const result = await bookingsServices.updateBookingsStatus(req.body.status, req.params.id as string)
    res.status(200).json({
        message: 'status updated successfully',
        data: result
    })
}

export const bookingsControllers = {
    addForBookings,
    getAllBookings,
    updateAvailabilityStatus
}