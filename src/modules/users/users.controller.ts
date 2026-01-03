import { Request, Response } from "express";
import { userServices } from "./users.service";
import { JwtPayload } from "jsonwebtoken";

const getUser = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getUser();
        res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            data: result.rows
        })
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })
    }
}


const updateUser = async (req: Request, res: Response) => {
    try {
        const checkUser = await userServices.checkUser(req.params.id as string)

        if (req.user?.role === 'admin' || checkUser.rows[0].email === req.user?.dbEmail) {
            const result = await userServices.updateUser(req.params.id as string, req.body, req.user as JwtPayload);
            if (result.rows.length === 0 || result.rowCount === 0) {
                res.status(404).json({
                    success: false,
                    message: 'Failed to update user'
                })
            } else {
                res.status(200).json({
                    success: true,
                    message: 'User updated successfully',
                    data: result.rows[0]
                })
            }
        } else {
            res.status(404).json({
                success: false,
                message: 'You can not update others user profile'
            })
        }
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })
    }
}


const deleteUser = async (req: Request, res: Response) => {
    try {
        const result = await userServices.deleteUser(req.params.id as string)
        if (result === false) {
            res.status(404).json({
                success: false,
                message: 'Failed to delete user'
            })
        } else {
            res.status(200).json({
                success: true,
                message: "User deleted successfully"
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
    updateUser,
    deleteUser
}