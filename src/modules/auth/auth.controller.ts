import { Request, Response } from "express";
import { authServices } from "./auth.service"
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import config from "../../config";

const createUser = async (req: Request, res: Response) => {
    try {
        const result = await authServices.createUser(req.body);
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: result.rows[0]
        })
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            errors: err
        })
    }
}

const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const result = await authServices.loginUser(email);
        if (result.rows.length === 0 || result.rowCount === 0) {
            res.status(400).json({
                success: false,
                message: 'No user available by this email'
            })
        } else {
            const { id, name, email: dbEmail, password: hashedPass, phone, role } = result.rows[0]

            const match = await bcrypt.compare(password, hashedPass)

            if (!match) {
                res.status(400).json({
                    success: false,
                    message: 'Incorrect Password'
                })
            } else {
                const token = jwt.sign({ name, dbEmail, role }, config.jwtSecret as string, {
                    expiresIn: "7d"
                })
                const plusPhone = '+' + phone
                const user = {
                    id,
                    name,
                    email: dbEmail,
                    phone: plusPhone,
                    role
                }

                res.status(200).json({
                    success: true,
                    message: 'Login successful',
                    data: { token, user }
                })
            }
        }



    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

export const authControllers = {
    createUser,
    loginUser
}