import express from 'express'
import { vehicleControllers } from './vehicles.controller';
import auth from '../../middleware/auth';

const router = express.Router();

router.post('/',auth('admin'), vehicleControllers.addNewVehicle)

router.get('/', vehicleControllers.getVehicle)

router.get('/:id', vehicleControllers.getSpecificVehicle)

router.put('/:id', vehicleControllers.updateSpecificVehicle)

router.delete('/:id', vehicleControllers.deleteVehicle)

export const vehicleRoutes = router