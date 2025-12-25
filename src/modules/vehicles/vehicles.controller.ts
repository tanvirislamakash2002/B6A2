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

const getVehicle = async (req: Request, res: Response) =>{
try{
const result = await vehiclesServices.getVehicle();
res.status(201).json({
    success:true,
    message:result.rows
})
}catch(err:any){
    res.status(500).json({
        success:false,
        message:'There is no data'
    })
}
}

const getSpecificVehicle = async(req:Request, res:Response)=>{
    const result = await vehiclesServices.getSpecificVehicle(req.params.id as string)
    res.status(200).json({
        success:true,
        details:result.rows
    })
}
export const vehicleControllers = {
    addNewVehicle,
    getVehicle,
    getSpecificVehicle
}