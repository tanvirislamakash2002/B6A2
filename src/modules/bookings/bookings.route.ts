import express from 'express'
import { bookingsControllers } from './bookings.controller'
import auth from '../../middleware/auth'

const router = express.Router()

router.post('/', bookingsControllers.addForBookings)

router.get('/',auth('admin', 'customer'), bookingsControllers.getAllBookings)

router.put('/:id', bookingsControllers.updateAvailabilityStatus)

export const bookingsRoutes=router