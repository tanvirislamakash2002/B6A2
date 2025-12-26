import express from 'express'
import { bookingsControllers } from './bookings.controller'

const router = express.Router()

router.post('/', bookingsControllers.addForBookings)

router.get('/', bookingsControllers.getAllBookings)

router.put('/:id', bookingsControllers.updateAvailabilityStatus)

export const bookingsRoutes=router