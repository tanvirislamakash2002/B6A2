import express from 'express'
import { vehicleControllers } from './vehicles.controller';
import auth from '../../middleware/auth';

const router = express.Router();

router.post('/', auth('admin'), vehicleControllers.addNewVehicle)

router.get('/', vehicleControllers.getVehicle)

router.get('/:id', vehicleControllers.getSpecificVehicle)

router.put('/:id', auth('admin'), vehicleControllers.updateSpecificVehicle)

router.delete('/:id', auth('admin'), vehicleControllers.deleteVehicle)

export const vehicleRoutes = router