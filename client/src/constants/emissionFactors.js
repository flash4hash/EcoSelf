/**
 * EcoSelf Carbon Emission Factors
 * All values are expressed in kg CO2e.
 * Sources:
 * - IPCC AR6 (Intergovernmental Panel on Climate Change Sixth Assessment Report)
 * - CEA CO2 Baseline Database for the Indian Power Sector (Central Electricity Authority, India)
 * - GHG Protocol Product Life Cycle Accounting and Reporting Standard
 */

export const EMISSION_FACTORS = {
  // Transport coefficients (kg CO2e per km)
  transport: {
    car: {
      petrol: 0.18,      // IPCC AR6 / GHG Protocol average petrol vehicle
      diesel: 0.20,      // IPCC AR6 diesel fuel combustion density
      electric: 0.10,    // Tailpipe 0, but India grid grid-mix (coal dominant) is high: 0.10 kg/km
      none: 0.0
    },
    twoWheeler: {
      petrol: 0.08,      // Standard Indian 100-150cc bike average
      electric: 0.04,    // Indirect emissions from Indian grid charging
      none: 0.0
    },
    flights: {
      domestic: 120.0,   // Per flight average (approx 1,000 km at 0.12 kg/km)
      intl: 440.0        // Per flight average (approx 4,000 km at 0.11 kg/km)
    },
    public: 0.05         // kg CO2e per passenger-hour (bus/metro average in India)
  },

  // Home Energy coefficients (kg CO2e per unit)
  energy: {
    electricity: 0.82,   // kg CO2e per kWh (CEA India Grid emission factor 2023/2024 is ~0.82)
    cooking: {
      lpg: 42.5,         // kg CO2e per standard 14.2 kg cylinder (combustion + upstream)
      png: 20.0,         // kg CO2e monthly average per household cooking footprint
      induction: 10.0    // kg CO2e monthly equivalent per person (indirect grid footprint)
    },
    electricityRate: 7.0 // Average tariff rate in INR per kWh
  },

  // Diet coefficients (kg CO2e per year)
  diet: {
    types: {
      none: 0,
      vegan: 1000,       // IPCC AR6 low-trophic plant-based nutrition
      vegetarian: 1400,  // Standard lacto-vegetarian Indian diet
      occasional_meat: 2000, // Poultry/fish occasionally (1-2x per week)
      regular_meat: 2800    // Frequent poultry, mutton, or fish (3x+ per week)
    },
    waste: {
      none: 0,
      low: 50,           // Minor agricultural/table losses
      medium: 150,       // Typical municipal waste contribution
      high: 300          // Elevated waste patterns
    }
  },

  // Lifestyle coefficients
  lifestyle: {
    shoppingOrder: 1.5,   // kg CO2e per package (packaging, freight, final-mile delivery)
    streamingHour: 0.05,  // kg CO2e per hour (device usage + local network routers + cloud data centres)
    plastic: {
      none: 0,
      rarely: 10,
      sometimes: 30,
      often: 80
    }
  }
};
