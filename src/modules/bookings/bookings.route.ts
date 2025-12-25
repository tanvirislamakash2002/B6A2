import express from 'express'
import { bookingsControllers } from './bookings.controller'

const router = express.Router()

router.post('/', bookingsControllers.addForBookings)

export const bookingsRoutes=router