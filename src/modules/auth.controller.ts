import { Request, Response } from "express";
import { userServices } from "./auth.service"

const createUser = async (req: Request, res: Response) => {
    try {
        const result = await userServices.createUser(req.body);
        res.status(201).json({
            success:true
        })
    }catch(err){
        console.log(err);
    }
}

export const userControllers = {
    createUser
}