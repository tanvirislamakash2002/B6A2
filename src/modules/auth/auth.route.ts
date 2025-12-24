import express from "express"
import { authControllers } from "./auth.controller"
const router =express.Router()

router.post('/', authControllers.createUser)

export const authRoutes= router