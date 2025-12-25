import { Request, Response } from "express";

const addNewVehicle=(req:Request,res:Response)=>{
    console.log(req.body);
}

export const vehicleControllers={
    addNewVehicle
}