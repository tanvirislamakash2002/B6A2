import { Request, Response } from "express";
import { vehiclesServices } from "./vehicles.service";

const addNewVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehiclesServices.addNewVehicle(req.body);
        res.status(201).json({
            success: true,
            result: result.rows[0]
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            result: err
        })
    }
}


export const vehicleControllers = {
    addNewVehicle
}