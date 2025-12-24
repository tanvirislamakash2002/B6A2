import { Request, Response } from "express";
import { userServices } from "./users.service";

const getUser = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getUser();
        res.status(201).json({
            success:true,
            data:result.rows
        })
    }catch(err){
        res.status(500).json({
            success:false,
            details:err
        })
    }
}

export const userControllers = {
    getUser
}