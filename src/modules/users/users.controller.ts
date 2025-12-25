import { Request, Response } from "express";
import { userServices } from "./users.service";

const getUser = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getUser();
        res.status(201).json({
            success: true,
            data: result.rows
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            details: err
        })
    }
}

const getSingleUser = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getSingleUser(req.params.id as string)

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "user not found",
                data: result.rows[0]
            })
        } else {
            res.status(200).json({
                success: true,
                message: "user fetched successfully",
                data: result.rows[0]
            })
        }
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const updateUser =async(req:Request, res:Response)=>{
    console.log('p',req.params);
    console.log('b',req.body);
}

const deleteUser = async (req: Request, res: Response) => {
    try {
        const result = await userServices.deleteUser(req.params.id as string)
        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            })
        } else {
            res.status(200).json({
                success: true,
                message: "User deleted successfully",
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
export const userControllers = {
    getUser,
    getSingleUser,
    updateUser,
    deleteUser
}