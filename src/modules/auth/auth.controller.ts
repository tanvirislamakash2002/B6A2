import { Request, Response } from "express";
import { userServices } from "./auth.service"

const createUser = async (req: Request, res: Response) => {
    try {
        const result = await userServices.createUser(req.body);
        res.status(201).json({
            success:true,
            result:result.rows[0]
        })
    }catch(err){
        res.status(500).json({
            success:false,
            result:err
        })
    }
}

export const userControllers = {
    createUser
}