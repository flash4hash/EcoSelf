import assert from 'assert';
import { EMISSION_FACTORS } from '../constants/emissionFactors.js';

let passed = 0;

function testDieselVsPetrol() {
  assert.ok(EMISSION_FACTORS.transport.car.diesel > EMISSION_FACTORS.transport.car.petrol, 'Diesel > Petrol');
  console.log('PASS: testDieselVsPetrol');
  passed++;
}

function testPetrolVsElectric() {
  assert.ok(EMISSION_FACTORS.transport.car.petrol > EMISSION_FACTORS.transport.car.electric, 'Petrol > Electric');
  console.log('PASS: testPetrolVsElectric');
  passed++;
}

function testFlights() {
  assert.ok(EMISSION_FACTORS.transport.flights.intl > EMISSION_FACTORS.transport.flights.domestic, 'Intl flight > Domestic flight');
  console.log('PASS: testFlights');
  passed++;
}

function testDietHierarchy() {
  assert.ok(EMISSION_FACTORS.diet.types.regular_meat > EMISSION_FACTORS.diet.types.occasional_meat, 'Regular > Occasional');
  assert.ok(EMISSION_FACTORS.diet.types.occasional_meat > EMISSION_FACTORS.diet.types.vegetarian, 'Occasional > Vegetarian');
  assert.ok(EMISSION_FACTORS.diet.types.vegetarian > EMISSION_FACTORS.diet.types.vegan, 'Vegetarian > Vegan');
  console.log('PASS: testDietHierarchy');
  passed++;
}

function testFoodWasteHierarchy() {
  assert.ok(EMISSION_FACTORS.diet.waste.high > EMISSION_FACTORS.diet.waste.medium, 'High > Medium waste');
  assert.ok(EMISSION_FACTORS.diet.waste.medium > EMISSION_FACTORS.diet.waste.low, 'Medium > Low waste');
  console.log('PASS: testFoodWasteHierarchy');
  passed++;
}

function testCEAIndiaElectricity() {
  assert.strictEqual(EMISSION_FACTORS.energy.electricity, 0.82, 'Electricity factor is 0.82');
  console.log('PASS: testCEAIndiaElectricity');
  passed++;
}

function testElectricityRate() {
  assert.ok(EMISSION_FACTORS.energy.electricityRate >= 5 && EMISSION_FACTORS.energy.electricityRate <= 12, 'Rate is between 5 and 12');
  console.log('PASS: testElectricityRate');
  passed++;
}

function testTransportFactorsPositive() {
  assert.ok(EMISSION_FACTORS.transport.car.petrol > 0, 'Petrol > 0');
  assert.ok(EMISSION_FACTORS.transport.car.diesel > 0, 'Diesel > 0');
  assert.ok(EMISSION_FACTORS.transport.car.electric > 0, 'Electric > 0');
  assert.strictEqual(EMISSION_FACTORS.transport.car.none, 0, 'None is 0');
  assert.ok(EMISSION_FACTORS.transport.flights.domestic > 0, 'Domestic flight > 0');
  assert.ok(EMISSION_FACTORS.transport.flights.intl > 0, 'Intl flight > 0');
  assert.ok(EMISSION_FACTORS.transport.public > 0, 'Public > 0');
  console.log('PASS: testTransportFactorsPositive');
  passed++;
}

try {
  testDieselVsPetrol();
  testPetrolVsElectric();
  testFlights();
  testDietHierarchy();
  testFoodWasteHierarchy();
  testCEAIndiaElectricity();
  testElectricityRate();
  testTransportFactorsPositive();
  console.log('✅ All 8 factor tests passed!');
} catch (err) {
  console.error('FAIL: ', err.stack);
  process.exit(1);
}
