import express from "express"
import { userControllers } from "./auth.controller"
const router =express.Router()

router.post('/', userControllers.createUser)

export const authRoutes= router