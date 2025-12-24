import express from "express"
import { userControllers } from "./users.controller"
const router =express.Router()

router.get('/', userControllers.getUser)

export const userRoutes= router