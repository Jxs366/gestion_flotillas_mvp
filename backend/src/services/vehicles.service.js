import { Router } from 'express';
const router = Router();

exports.listVehicles = async () => {
  return await vehicleModel.findAll();
};

exports.addVehicle = async (plate, model) => {
  if (!plate) throw new Error('La placa es obligatoria');
  return await vehicleModel.create({ plate, model });
};

export default router;