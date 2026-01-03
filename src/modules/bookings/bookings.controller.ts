import { Request, Response } from "express";
import { bookingsServices } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";

const addForBookings = async (req: Request, res: Response) => {
    try {
        const { vehicle_id, rent_start_date, rent_end_date } = req.body;

        const checkIsAvailable = await bookingsServices.checkIsAvailable(vehicle_id)

        if (checkIsAvailable.rows.length === 0 || checkIsAvailable.rowCount === 0) {
            res.status(400).json({
                success: false,
                message: 'No vehicle available for booking'
            })
        } else {
            const { daily_rent_price } = checkIsAvailable.rows[0]

            const startDate = new Date(rent_start_date as string)
            const endDate = new Date(rent_end_date as string)

            const number_of_days = Math.ceil(endDate.getTime() - startDate.getTime()) / (60 * 60 * 24 * 1000)

            const total_price = number_of_days * daily_rent_price;

            const result = await bookingsServices.addForBookings(req.body, total_price as number)

            res.status(200).json({
                success: true,
                message: 'Booking created successfully',
                data: result.rows[0]
            })
        }
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            errors: err
        })
    }
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
        if (!result) {
            res.status(404).json({
                success: true,
                message: successMessage,
                data: result,
                user: req.user
            })
        } else {
            if (result.rowCount === 0) {
                res.status(500).json({
                    success: false,
                    message: 'No bookings found',
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
        res.status(500).json({
            success: false,
            message: err
        })
    }
}

const updateAvailabilityStatus = async (req: Request, res: Response) => {
    let successMessage;
    if (req.user) {
        if (req.user.role === 'admin') {
            successMessage = 'Booking marked as returned. Vehicle is now available'
        } else if (req.user.role === 'customer') {
            successMessage = 'Booking cancelled successfully'
        }
    } else {
        successMessage = 'unauthorize access'
    }
    try {
        const result = await bookingsServices.updateBookingsStatus(req.params.id as string, req.body.status, req.user as JwtPayload)

        if (!result) {
            res.status(404).json({
                success: false,
                message: 'You have no permission to update this booking'
            })
        } else {
            if (result.rowCount === 0) {
                res.status(500).json({
                    success: false,
                    message: 'failed to update'
                })
            } else {
                res.status(200).json({
                    success: true,
                    message: successMessage,
                    data: result.rows[0]
                })
            }
        }

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err
        })
    }
}

export const bookingsControllers = {
    addForBookings,
    getAllBookings,
    updateAvailabilityStatus
}