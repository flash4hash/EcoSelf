import assert from 'assert';
import { calculateFootprint } from './calculateFootprint.js';

function testAllZeros() {
  const inputs = {
    transport: { carKm: 0, carFuel: 'none', bikeKm: 0, bikeFuel: 'none', flightsDomestic: 0, flightsIntl: 0, publicHours: 0 },
    energy: { electricityBill: 0, cookingFuel: 'none', lpgCylinders: 0, householdSize: 1 },
    diet: { dietType: 'none', foodWaste: 'none' },
    lifestyle: { shoppingOrders: 0, streamingHours: 0, singleUsePlastic: 'none' }
  };
  const results = calculateFootprint(inputs);
  assert.strictEqual(results.transport, 0);
  assert.strictEqual(results.energy, 0);
  assert.strictEqual(results.diet, 0);
  assert.strictEqual(results.lifestyle, 0);
  assert.strictEqual(results.total, 0);
  console.log('PASS: testAllZeros');
}

function testTotalEqualsSum() {
  const inputs = {
    transport: { carKm: 150, carFuel: 'petrol', bikeKm: 0, flightsDomestic: 0, flightsIntl: 0 },
    energy: { electricityBill: 2000, cookingFuel: 'lpg', lpgCylinders: 1, householdSize: 2 },
    diet: { dietType: 'vegetarian', foodWaste: 'medium' },
    lifestyle: { shoppingOrders: 3, streamingHours: 3, singleUsePlastic: 'sometimes' }
  };
  const results = calculateFootprint(inputs);
  assert.strictEqual(results.total, results.transport + results.energy + results.diet + results.lifestyle);
  console.log('PASS: testTotalEqualsSum');
}

function testExactPetrolCarMath() {
  const inputs = {
    transport: { carKm: 100, carFuel: 'petrol', bikeKm: 0, bikeFuel: 'none', flightsDomestic: 0, flightsIntl: 0, publicHours: 0 },
    energy: { electricityBill: 0, cookingFuel: 'none', lpgCylinders: 0, householdSize: 1 },
    diet: { dietType: 'none', foodWaste: 'none' },
    lifestyle: { shoppingOrders: 0, streamingHours: 0, singleUsePlastic: 'none' }
  };
  const results = calculateFootprint(inputs);
  assert.strictEqual(results.transport, 936);
  console.log('PASS: testExactPetrolCarMath');
}

function testExactFlightMath() {
  const inputs = {
    transport: { carKm: 0, carFuel: 'none', bikeKm: 0, bikeFuel: 'none', flightsDomestic: 3, flightsIntl: 2, publicHours: 0 },
    energy: { electricityBill: 0, cookingFuel: 'none', lpgCylinders: 0, householdSize: 1 },
    diet: { dietType: 'none', foodWaste: 'none' },
    lifestyle: { shoppingOrders: 0, streamingHours: 0, singleUsePlastic: 'none' }
  };
  const results = calculateFootprint(inputs);
  assert.strictEqual(results.transport, 1240);
  console.log('PASS: testExactFlightMath');
}

function testDieselVsPetrol() {
  const getInputs = (fuel) => ({
    transport: { carKm: 200, carFuel: fuel, bikeKm: 0, bikeFuel: 'none', flightsDomestic: 0, flightsIntl: 0, publicHours: 0 },
    energy: { electricityBill: 0, cookingFuel: 'none', lpgCylinders: 0, householdSize: 1 },
    diet: { dietType: 'none', foodWaste: 'none' },
    lifestyle: { shoppingOrders: 0, streamingHours: 0, singleUsePlastic: 'none' }
  });
  const dieselResults = calculateFootprint(getInputs('diesel'));
  const petrolResults = calculateFootprint(getInputs('petrol'));
  assert.ok(dieselResults.transport > petrolResults.transport);
  console.log('PASS: testDieselVsPetrol');
}

function testElectricVsPetrol() {
  const getInputs = (fuel) => ({
    transport: { carKm: 200, carFuel: fuel, bikeKm: 0, bikeFuel: 'none', flightsDomestic: 0, flightsIntl: 0, publicHours: 0 },
    energy: { electricityBill: 0, cookingFuel: 'none', lpgCylinders: 0, householdSize: 1 },
    diet: { dietType: 'none', foodWaste: 'none' },
    lifestyle: { shoppingOrders: 0, streamingHours: 0, singleUsePlastic: 'none' }
  });
  const electricResults = calculateFootprint(getInputs('electric'));
  const petrolResults = calculateFootprint(getInputs('petrol'));
  assert.ok(electricResults.transport < petrolResults.transport);
  console.log('PASS: testElectricVsPetrol');
}

function testHouseholdSizeReducesEnergy() {
  const getInputs = (size) => ({
    transport: { carKm: 0, carFuel: 'none', bikeKm: 0, bikeFuel: 'none', flightsDomestic: 0, flightsIntl: 0, publicHours: 0 },
    energy: { electricityBill: 3000, cookingFuel: 'lpg', lpgCylinders: 1, householdSize: size },
    diet: { dietType: 'none', foodWaste: 'none' },
    lifestyle: { shoppingOrders: 0, streamingHours: 0, singleUsePlastic: 'none' }
  });
  const singlePersonResults = calculateFootprint(getInputs(1));
  const familyResults = calculateFootprint(getInputs(4));
  assert.ok(singlePersonResults.energy > familyResults.energy);
  console.log('PASS: testHouseholdSizeReducesEnergy');
}

function testElectricityBillScaling() {
  const getInputs = (bill) => ({
    transport: { carKm: 0, carFuel: 'none', bikeKm: 0, bikeFuel: 'none', flightsDomestic: 0, flightsIntl: 0, publicHours: 0 },
    energy: { electricityBill: bill, cookingFuel: 'none', lpgCylinders: 0, householdSize: 1 },
    diet: { dietType: 'none', foodWaste: 'none' },
    lifestyle: { shoppingOrders: 0, streamingHours: 0, singleUsePlastic: 'none' }
  });
  const highBillResults = calculateFootprint(getInputs(5000));
  const lowBillResults = calculateFootprint(getInputs(1000));
  assert.ok(highBillResults.energy > lowBillResults.energy);
  console.log('PASS: testElectricityBillScaling');
}

function testMeatVsVeganDiet() {
  const getInputs = (diet) => ({
    transport: { carKm: 0, carFuel: 'none', bikeKm: 0, bikeFuel: 'none', flightsDomestic: 0, flightsIntl: 0, publicHours: 0 },
    energy: { electricityBill: 0, cookingFuel: 'none', lpgCylinders: 0, householdSize: 1 },
    diet: { dietType: diet, foodWaste: 'low' },
    lifestyle: { shoppingOrders: 0, streamingHours: 0, singleUsePlastic: 'none' }
  });
  const regularMeatResults = calculateFootprint(getInputs('regular_meat'));
  const veganResults = calculateFootprint(getInputs('vegan'));
  assert.ok(regularMeatResults.diet > veganResults.diet);
  console.log('PASS: testMeatVsVeganDiet');
}

function testFoodWasteScaling() {
  const getInputs = (waste) => ({
    transport: { carKm: 0, carFuel: 'none', bikeKm: 0, bikeFuel: 'none', flightsDomestic: 0, flightsIntl: 0, publicHours: 0 },
    energy: { electricityBill: 0, cookingFuel: 'none', lpgCylinders: 0, householdSize: 1 },
    diet: { dietType: 'vegetarian', foodWaste: waste },
    lifestyle: { shoppingOrders: 0, streamingHours: 0, singleUsePlastic: 'none' }
  });
  const highWasteResults = calculateFootprint(getInputs('high'));
  const lowWasteResults = calculateFootprint(getInputs('low'));
  assert.ok(highWasteResults.diet > lowWasteResults.diet);
  console.log('PASS: testFoodWasteScaling');
}

function testHouseholdSizeZero() {
  const inputs = {
    transport: { carKm: 0, carFuel: 'none', bikeKm: 0, bikeFuel: 'none', flightsDomestic: 0, flightsIntl: 0, publicHours: 0 },
    energy: { electricityBill: 2000, cookingFuel: 'lpg', lpgCylinders: 1, householdSize: 0 },
    diet: { dietType: 'none', foodWaste: 'none' },
    lifestyle: { shoppingOrders: 0, streamingHours: 0, singleUsePlastic: 'none' }
  };
  const results = calculateFootprint(inputs);
  assert.strictEqual(typeof results.energy, 'number');
  assert.ok(Number.isFinite(results.energy));
  assert.ok(results.energy >= 0);
  console.log('PASS: testHouseholdSizeZero');
}

function testNaNAndUndefined() {
  const inputs = {
    transport: { carKm: NaN, bikeKm: undefined, flightsDomestic: null, carFuel: 'none', bikeFuel: 'none', flightsIntl: 0, publicHours: 0 },
    energy: { electricityBill: undefined, cookingFuel: 'none', lpgCylinders: 0, householdSize: 1 },
    diet: { dietType: 'none', foodWaste: 'none' },
    lifestyle: { shoppingOrders: NaN, streamingHours: 0, singleUsePlastic: 'none' }
  };
  const results = calculateFootprint(inputs);
  assert.ok(!isNaN(results.transport));
  assert.ok(!isNaN(results.energy));
  assert.ok(!isNaN(results.total));
  assert.ok(results.total >= 0);
  console.log('PASS: testNaNAndUndefined');
}

// Run all tests
testAllZeros();
testTotalEqualsSum();
testExactPetrolCarMath();
testExactFlightMath();
testDieselVsPetrol();
testElectricVsPetrol();
testHouseholdSizeReducesEnergy();
testElectricityBillScaling();
testMeatVsVeganDiet();
testFoodWasteScaling();
testHouseholdSizeZero();
testNaNAndUndefined();

console.log('🎉 All 12 tests passed!');
