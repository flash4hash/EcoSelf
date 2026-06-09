import { EMISSION_FACTORS } from '../constants/emissionFactors.js';

/**
 * Calculates annual carbon footprint in kg CO2e
 * @param {Object} inputs - The form inputs from the multi-step calculator
 * @returns {Object} - Annual emissions breakdown by category: transport, energy, diet, lifestyle, and total.
 */
export function calculateFootprint(inputs) {
  // Default structure in case of partial inputs
  const data = {
    transport: {
      carKm: Number(inputs?.transport?.carKm || 0),
      carFuel: inputs?.transport?.carFuel || 'none',
      bikeKm: Number(inputs?.transport?.bikeKm || 0),
      bikeFuel: inputs?.transport?.bikeFuel || 'none',
      flightsDomestic: Number(inputs?.transport?.flightsDomestic || 0),
      flightsIntl: Number(inputs?.transport?.flightsIntl || 0),
      publicHours: Number(inputs?.transport?.publicHours || 0)
    },
    energy: {
      electricityBill: Number(inputs?.energy?.electricityBill || 0),
      cookingFuel: inputs?.energy?.cookingFuel || 'induction',
      lpgCylinders: Number(inputs?.energy?.lpgCylinders || 0),
      householdSize: Number(inputs?.energy?.householdSize || 1)
    },
    diet: {
      dietType: inputs?.diet?.dietType || 'vegetarian',
      foodWaste: inputs?.diet?.foodWaste || 'medium'
    },
    lifestyle: {
      shoppingOrders: Number(inputs?.lifestyle?.shoppingOrders || 0),
      streamingHours: Number(inputs?.lifestyle?.streamingHours || 0),
      singleUsePlastic: inputs?.lifestyle?.singleUsePlastic || 'sometimes'
    }
  };

  // 1. Transport Emissions (kg CO2e/year)
  const carFactor = EMISSION_FACTORS.transport.car[data.transport.carFuel] || 0;
  const carEmissions = data.transport.carKm * 52 * carFactor; // Weekly to annual

  const bikeFactor = EMISSION_FACTORS.transport.twoWheeler[data.transport.bikeFuel] || 0;
  const bikeEmissions = data.transport.bikeKm * 52 * bikeFactor; // Weekly to annual

  const flightEmissions = 
    (data.transport.flightsDomestic * EMISSION_FACTORS.transport.flights.domestic) +
    (data.transport.flightsIntl * EMISSION_FACTORS.transport.flights.intl);

  const publicEmissions = data.transport.publicHours * 52 * EMISSION_FACTORS.transport.public;

  const totalTransport = Math.round(carEmissions + bikeEmissions + flightEmissions + publicEmissions);

  // 2. Home Energy Emissions (kg CO2e/year)
  // Convert INR bill to kWh, then multiply by grid emission factor
  const annualKwh = (data.energy.electricityBill / EMISSION_FACTORS.energy.electricityRate) * 12;
  const householdElectricityEmissions = annualKwh * EMISSION_FACTORS.energy.electricity;

  // Cooking emissions (household total)
  let householdCookingEmissions = 0;
  if (data.energy.cookingFuel === 'lpg') {
    householdCookingEmissions = data.energy.lpgCylinders * 12 * EMISSION_FACTORS.energy.cooking.lpg;
  } else if (data.energy.cookingFuel === 'png') {
    householdCookingEmissions = 12 * EMISSION_FACTORS.energy.cooking.png;
  } else if (data.energy.cookingFuel === 'induction') {
    householdCookingEmissions = 12 * EMISSION_FACTORS.energy.cooking.induction;
  }

  const householdSize = data.energy.householdSize > 0 ? data.energy.householdSize : 1;
  const totalEnergy = Math.round((householdElectricityEmissions + householdCookingEmissions) / householdSize);

  // 3. Diet Emissions (kg CO2e/year)
  const dietFactor = EMISSION_FACTORS.diet.types[data.diet.dietType] !== undefined 
    ? EMISSION_FACTORS.diet.types[data.diet.dietType] 
    : EMISSION_FACTORS.diet.types.vegetarian;
  
  const wasteFactor = EMISSION_FACTORS.diet.waste[data.diet.foodWaste] !== undefined 
    ? EMISSION_FACTORS.diet.waste[data.diet.foodWaste] 
    : EMISSION_FACTORS.diet.waste.medium;

  const totalDiet = Math.round(dietFactor + wasteFactor);

  // 4. Lifestyle Emissions (kg CO2e/year)
  const shoppingEmissions = data.lifestyle.shoppingOrders * 12 * EMISSION_FACTORS.lifestyle.shoppingOrder;
  const streamingEmissions = data.lifestyle.streamingHours * 365 * EMISSION_FACTORS.lifestyle.streamingHour;
  const plasticEmissions = EMISSION_FACTORS.lifestyle.plastic[data.lifestyle.singleUsePlastic] !== undefined 
    ? EMISSION_FACTORS.lifestyle.plastic[data.lifestyle.singleUsePlastic] 
    : EMISSION_FACTORS.lifestyle.plastic.sometimes;

  const totalLifestyle = Math.round(shoppingEmissions + streamingEmissions + plasticEmissions);

  // Total Carbon Footprint (kg CO2e/year)
  const total = totalTransport + totalEnergy + totalDiet + totalLifestyle;

  return {
    transport: totalTransport,
    energy: totalEnergy,
    diet: totalDiet,
    lifestyle: totalLifestyle,
    total: total
  };
}
export default calculateFootprint;
