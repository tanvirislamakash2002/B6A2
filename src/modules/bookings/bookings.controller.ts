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

            const total_price = Math.round(number_of_days * daily_rent_price);

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

    try {
        if (req.user?.role === 'admin') {
            const result = await bookingsServices.getAllBookings();
            if (result.rows.length === 0 || result.rowCount === 0) {
                res.status(200).json({
                    success: false,
                    message: 'No Bookings Found'
                })
            } else {
                res.status(200).json({
                    success: true,
                    message: 'Bookings retrieved successfully',
                    data: result.rows
                })
            }
        }
        else if (req.user?.role === 'customer') {
            const result = await bookingsServices.getOwnBookings(req.user as JwtPayload);
            if (result.rows.length === 0 || result.rowCount === 0) {
                res.status(200).json({
                    success: false,
                    message: 'No Bookings Found'
                })
            } else {
                res.status(200).json({
                    success: true,
                    message: 'Your bookings retrieved successfully',
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

    try {

        if (req.user?.role === 'admin' && req.body.status === 'returned') {
            const result = await bookingsServices.statusUpdateByAdmin(req.params.id as string, req.body.status)

            res.status(200).json({
                success: true,
                message: 'Booking marked as returned. Vehicle is now available',
                data: result.rows[0]
            })

        } else if (req.user?.role === 'customer' && req.body.status === 'cancelled') {
            const get_rent_start_date = await bookingsServices.getRentStartDate(req.params.id as string)

            const currentDate = new Date().getTime() / (60 * 60 * 24 * 1000);

            const rentStartDate = new Date(get_rent_start_date.rows[0].rent_start_date).getTime() / (60 * 60 * 24 * 1000);

            console.log(currentDate, rentStartDate);

            if (rentStartDate > currentDate) {
                const result = await bookingsServices.statusUpdateByCustomer(req.params.id as string, req.body.status)

                res.status(200).json({
                    success: true,
                    message: 'Booking cancelled successfully',
                    data: result.rows[0]
                })
            } else {
                res.status(400).json({
                    success: false,
                    message: 'You can not cancel the booking after reaching the start day'
                })
            }

        }else{
            res.status(400).json({
                success:false,
                message:"You can not update the booking"
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

export const bookingsControllers = {
    addForBookings,
    getAllBookings,
    updateAvailabilityStatus
}