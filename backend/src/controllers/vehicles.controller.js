// src/controllers/vehicles.controller.js
import vehicleModel from '../models/vehicle.model.js'; // Asegúrate de importar tu modelo

export const listVehicles = async (req, res) => {
  try {
    const vehicles = await vehicleModel.findAll();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addVehicle = async (req, res) => {
  try {
    const { plate, model } = req.body;
    
    if (!plate) {
      return res.status(400).json({ message: 'La placa es obligatoria' });
    }

    const newVehicle = await vehicleModel.create({ plate, model });
    res.status(201).json(newVehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};