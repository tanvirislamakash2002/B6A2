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

const loginUser = async(req:Request, res:Response)=>{
    const {email, password}=req.body;
try{
    const result = await authServices.loginUser(email, password);

    res.status(200).json({
        success:false,
        data:result
    })
}catch(err:any){
    res.status(500).json({
        success:false,
        message:err.message
    })
}
}

export const authControllers = {
    createUser,
    loginUser
}