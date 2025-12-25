import { Request, Response } from "express";

const addForBookings=(req:Request,res:Response)=>{
    res.status(200).json({
        message:'data not found',
        data:req.body
    })
}

export const bookingsControllers={
    addForBookings
}