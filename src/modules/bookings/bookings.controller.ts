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
    let successMessage;
    if (req.user) {
        if (req.user.role === 'admin') {
            successMessage = 'Bookings retrieved successfully';
        } else if (req.user.role === 'customer') {
            successMessage = 'Your bookings retrieved successfully'
        }
    } else {
        successMessage = 'unauthorize access'
    }
    try {
        const result = await bookingsServices.getAllBookings(req.user as JwtPayload);
        if (result === null) {
            res.status(404).json({
                success: true,
                message: successMessage,
                data: result,
                user: req.user

            })

        } else {
            if (result.rowCount === 0) {

                res.status(500).json({
                    message: successMessage,
                    data: result.rows
                })
            } else {

                res.status(200).json({
                    success: true,
                    message: successMessage,
                    data: result.rows
                })
            }
        }

    } catch (err: any) {

    }
}

const updateAvailabilityStatus = async (req: Request, res: Response) => {
    const result = await bookingsServices.updateBookingsStatus(req.body.status, req.user as JwtPayload)
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