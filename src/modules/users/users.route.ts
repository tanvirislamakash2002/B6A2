import express from "express"
import { userControllers } from "./users.controller"
const router = express.Router()

router.get('/', userControllers.getUser)

router.get('/:id', userControllers.getSingleUser)

router.put('/:id', userControllers.updateUser)

router.delete('/:id', userControllers.deleteUser)

export const userRoutes = router