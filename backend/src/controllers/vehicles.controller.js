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
    // 1. Extraer TODOS los campos del body
    const { plate, model, vin, make, year, current_odometer } = req.body;
    
    // 2. Validar obligatorios
    if (!plate || !model || !vin || !make) {
      return res.status(400).json({ message: 'Faltan campos obligatorios (Vin, Placa, Marca, Modelo)' });
    }

    // 3. Llamar al modelo pasando el objeto completo
    const newVehicle = await vehicleModel.create({ 
        plate, model, vin, make, year, current_odometer 
    });
    
    res.status(201).json(newVehicle);
  } catch (error) {
    // Manejo de errores (ej. llave duplicada en VIN o Placa)
    if (error.code === '23505') { 
        return res.status(400).json({ message: 'El VIN o la Placa ya están registrados.' });
    }
    res.status(500).json({ message: error.message });
  }
};