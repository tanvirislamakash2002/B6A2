import { Request, Response } from "express";
import { vehiclesServices } from "./vehicles.service";

const addNewVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehiclesServices.addNewVehicle(req.body);
        res.status(201).json({
            success: true,
            message:'Vehicle created successfully',
            data: result.rows[0]
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            result: err
        })
    }
}

const getVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehiclesServices.getVehicle();
        res.status(201).json({
            success: true,
            message:'Vehicles retrieved successfully',
            data: result.rows
        })
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: 'There is no data'
        })
    }
}

const getSpecificVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehiclesServices.getSpecificVehicle(req.params.id as string)
        if (result.rows.length === 0) {

            res.status(404).json({
                success: false,
                message: 'no data available',
                details: result.rows[0]
            })

        } else {
            res.status(200).json({
                success: true,
                message: 'successfully fetched data',
                details: result.rows[0]
            })
        }

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }

}

const updateSpecificVehicle = async (req: Request, res: Response) => {
    const props = req.body;
    props.id = req.params.id;
    try {
        const result = await vehiclesServices.updateSpecificVehicle(props)
        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "data not found",
                data: result.rows
            })
        } else {
            res.status(200).json({
                success: true,
                message: "Successfully updated data",
                data: result.rows
            })

        }
    } catch (err: any) {
        res.status(200).json({
            success: false,
            message: err.message
        })
    }
}

const deleteVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehiclesServices.deleteVehicle(req.params.id as string)

        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "No data found",
                details: result
            })
        } else {
            res.status(200).json({
                success: true,
                message: "Data deleted successfully",
                data: result.rows
            })
        }
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}
export const vehicleControllers = {
    addNewVehicle,
    getVehicle,
    getSpecificVehicle,
    updateSpecificVehicle,
    deleteVehicle
}