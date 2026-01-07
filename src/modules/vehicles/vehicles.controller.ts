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
    } catch (err:any) {
        res.status(500).json({
            success: false,
            message: err.message,
            errors: err
        })
    }
}

const getVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehiclesServices.getVehicle();
        if(result.rowCount===0){
            res.status(200).json({
                success:true,
                message:'No vehicles found',
                data:result.rows
            })
        }else{
            res.status(200).json({
                success: true,
                message:'Vehicles retrieved successfully',
                data: result.rows
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

const getSpecificVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehiclesServices.getSpecificVehicle(req.params.id as string)
        if (result.rowCount === 0) {
            res.status(200).json({
                success: true,
                message: 'No vehicles found',
                data: result.rows
            })
        } else {
            res.status(200).json({
                success: true,
                message: 'Vehicle retrieved successfully',
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

const updateSpecificVehicle = async (req: Request, res: Response) => {
    const props = req.body;
    props.id = req.params.id;
    try {
        const result = await vehiclesServices.updateSpecificVehicle(props)
        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "Filed to update Vehicle",
                data: result.rows
            })
        } else {
            res.status(200).json({
                success: true,
                message: "Vehicle updated successfully",
                data: result.rows[0]
            })

        }
    } catch (err: any) {
        res.status(200).json({
            success: false,
            message: err.message,
            errors: err
        })
    }
}

const deleteVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehiclesServices.deleteVehicle(req.params.id as string)

        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "Failed to delete vehicle"
            })
        } else {
            res.status(200).json({
                success: true,
                message: "Vehicle deleted successfully"
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
export const vehicleControllers = {
    addNewVehicle,
    getVehicle,
    getSpecificVehicle,
    updateSpecificVehicle,
    deleteVehicle
}