import express from 'express'
import { vehicleControllers } from './vehicles.controller';

const router = express.Router();

router.post('/', vehicleControllers.addNewVehicle)

router.get('/', vehicleControllers.getVehicle)

router.get('/:id', vehicleControllers.getSpecificVehicle)

router.put('/:id', vehicleControllers.updateSpecificVehicle)

export const vehicleRoutes = router