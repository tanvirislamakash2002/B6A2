import { Request, Response } from "express";
import { authServices } from "./auth.service"

const createUser = async (req: Request, res: Response) => {
    try {
        const result = await authServices.createUser(req.body);
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

export const authControllers = {
    createUser
}