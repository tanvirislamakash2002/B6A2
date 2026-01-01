import { Request, Response } from "express";
import { bookingsServices } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";

const addForBookings = async (req: Request, res: Response) => {
    const result = await bookingsServices.addForBookings(req.body)
    if(!result){
        res.status(404).json({
            success:false,
            message:'No vehicle available for booking'
        })
    }else{
        res.status(200).json({
            success:true,
            message:'Booking created successfully',
            data:result.rows[0]
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
        
        if(result===null){
            res.status(404).json({
                success:false,
                message:successMessage
            })
        }else{
            if(result.rowCount===0){
                res.status(500).json({
                    success:false,
                    message:'failed to update'
                })
            }else{
                res.status(200).json({
                    success:true,
                    message:successMessage
                })
            }
        }

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err,
            catch: 'catch the error'
        })
    }
}

export const bookingsControllers = {
    addForBookings,
    getAllBookings,
    updateAvailabilityStatus
}