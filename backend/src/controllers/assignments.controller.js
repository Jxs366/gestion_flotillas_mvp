import VehicleModel from "../models/vehicle.model.js";

// GET: Vehículos de un chofer
export const getDriverVehicles = async (req, res) => {
  const { driverId } = req.params;
  try {
    const vehicles = await VehicleModel.findByDriverId(driverId);
    res.json(vehicles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener vehículos del conductor" });
  }
};

// GET: Vehículos disponibles
export const getAvailableVehicles = async (req, res) => {
  try {
    const vehicles = await VehicleModel.findAvailable();
    res.json(vehicles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al buscar vehículos disponibles" });
  }
};

// POST: Asignar vehículo
export const assignVehicle = async (req, res) => {
  const { driverId } = req.params;
  const { vehicleId } = req.body;

  if (!vehicleId) {
    return res.status(400).json({ message: "Falta el ID del vehículo" });
  }

  try {
    await VehicleModel.assignToDriver(vehicleId, driverId);
    res.json({ message: "Vehículo asignado correctamente" });
  } catch (error) {
    console.error(error);
    if (error.message && error.message.includes("ocupado")) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Error interno al asignar vehículo" });
  }
};

// POST: Desvincular vehículo
export const unassignVehicle = async (req, res) => {
  const { vehicleId } = req.body;
  console.log("Desvinculando ID:", vehicleId);

  if (!vehicleId) return res.status(400).json({ message: "Falta ID" });

  try {
    await VehicleModel.unassign(vehicleId);
    
    res.json({ message: "Vehículo desvinculado correctamente" });
  } catch (error) {
    console.error("🔥 Error en controller:", error); 
    res.status(500).json({ message: "Error interno: " + error.message });
  }
};