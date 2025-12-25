import express from 'express'
import { vehicleControllers } from './vehicles.controller';

const router = express.Router();

router.post('/', vehicleControllers.addNewVehicle)

export const vehicleRoutes = router