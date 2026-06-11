import assert from 'assert';
import { calculateFootprint } from './calculateFootprint.js';

let passed = 0;

const baseFormData = {
  transport: {
    carKm: 0,
    carFuel: 'none',
    bikeKm: 0,
    bikeFuel: 'none',
    publicHours: 0,
    flightsDomestic: 0,
    flightsIntl: 0
  },
  energy: {
    electricityBill: 0,
    cookingFuel: 'none',
    lpgCylinders: 0,
    pngBill: 0,
    householdSize: 1
  },
  diet: {
    dietType: 'vegan',
    foodWaste: 'none'
  },
  lifestyle: {
    shoppingOrders: 0,
    streamingHours: 0,
    singleUsePlastic: 'none'
  }
};

function testVeganZeroWaste() {
  const data = JSON.parse(JSON.stringify(baseFormData));
  const results = calculateFootprint(data);
  assert.strictEqual(results.diet, 1000);
  console.log('PASS: testVeganZeroWaste');
  passed++;
}

function testRegularMeatHighWaste() {
  const data = JSON.parse(JSON.stringify(baseFormData));
  data.diet.dietType = 'regular_meat';
  data.diet.foodWaste = 'high';
  const results = calculateFootprint(data);
  assert.strictEqual(results.diet, 3100);
  console.log('PASS: testRegularMeatHighWaste');
  passed++;
}

function testExactPublicTransportMath() {
  const data = JSON.parse(JSON.stringify(baseFormData));
  data.transport.publicHours = 10;
  const results = calculateFootprint(data);
  assert.strictEqual(results.transport, Math.round(10 * 52 * 0.05));
  console.log('PASS: testExactPublicTransportMath');
  passed++;
}

function testExactElectricBikeMath() {
  const data = JSON.parse(JSON.stringify(baseFormData));
  data.transport.bikeKm = 100;
  data.transport.bikeFuel = 'electric';
  const results = calculateFootprint(data);
  assert.strictEqual(results.transport, Math.round(100 * 52 * 0.04));
  console.log('PASS: testExactElectricBikeMath');
  passed++;
}

function testExactLPGMath() {
  const data = JSON.parse(JSON.stringify(baseFormData));
  data.energy.cookingFuel = 'lpg';
  data.energy.lpgCylinders = 2;
  const results = calculateFootprint(data);
  assert.strictEqual(results.energy, Math.round((2 * 12 * 42.5) / 1));
  console.log('PASS: testExactLPGMath');
  passed++;
}

function testExactShoppingMath() {
  const data = JSON.parse(JSON.stringify(baseFormData));
  data.lifestyle.shoppingOrders = 5;
  const results = calculateFootprint(data);
  assert.strictEqual(results.lifestyle, Math.round(5 * 12 * 1.5));
  console.log('PASS: testExactShoppingMath');
  passed++;
}

function testExactStreamingMath() {
  const data = JSON.parse(JSON.stringify(baseFormData));
  data.lifestyle.streamingHours = 2;
  const results = calculateFootprint(data);
  assert.strictEqual(results.lifestyle, Math.round(2 * 365 * 0.05));
  console.log('PASS: testExactStreamingMath');
  passed++;
}

function testPlasticOften() {
  const data = JSON.parse(JSON.stringify(baseFormData));
  data.lifestyle.singleUsePlastic = 'often';
  const results = calculateFootprint(data);
  assert.strictEqual(results.lifestyle, 80);
  console.log('PASS: testPlasticOften');
  passed++;
}

function testHouseholdSizeFourVsOne() {
  const data1 = JSON.parse(JSON.stringify(baseFormData));
  data1.energy.electricityBill = 7000;
  const singlePerson = calculateFootprint(data1);

  const data4 = JSON.parse(JSON.stringify(baseFormData));
  data4.energy.electricityBill = 7000;
  data4.energy.householdSize = 4;
  const fourPerson = calculateFootprint(data4);

  assert.strictEqual(singlePerson.energy, fourPerson.energy * 4);
  console.log('PASS: testHouseholdSizeFourVsOne');
  passed++;
}

function testAllCategoriesIndependent() {
  const dataT = JSON.parse(JSON.stringify(baseFormData));
  dataT.transport.carKm = 50;
  dataT.transport.carFuel = 'petrol';

  const dataE = JSON.parse(JSON.stringify(baseFormData));
  dataE.energy.electricityBill = 1000;
  
  const dataL = JSON.parse(JSON.stringify(baseFormData));
  dataL.lifestyle.shoppingOrders = 10;
  
  const resultsT = calculateFootprint(dataT);
  const resultsE = calculateFootprint(dataE);
  const resultsL = calculateFootprint(dataL);

  const dataAll = JSON.parse(JSON.stringify(baseFormData));
  dataAll.transport.carKm = 50;
  dataAll.transport.carFuel = 'petrol';
  dataAll.energy.electricityBill = 1000;
  dataAll.lifestyle.shoppingOrders = 10;
  const resultsAll = calculateFootprint(dataAll);
  
  assert.strictEqual(resultsAll.transport, resultsT.transport);
  assert.strictEqual(resultsAll.energy, resultsE.energy);
  assert.strictEqual(resultsAll.lifestyle, resultsL.lifestyle);
  assert.strictEqual(resultsAll.total, resultsAll.transport + resultsAll.energy + resultsAll.diet + resultsAll.lifestyle);

  console.log('PASS: testAllCategoriesIndependent');
  passed++;
}

try {
  testVeganZeroWaste();
  testRegularMeatHighWaste();
  testExactPublicTransportMath();
  testExactElectricBikeMath();
  testExactLPGMath();
  testExactShoppingMath();
  testExactStreamingMath();
  testPlasticOften();
  testHouseholdSizeFourVsOne();
  testAllCategoriesIndependent();
  console.log('✅ All 10 edge case tests passed!');
} catch (err) {
  console.error('FAIL: ', err.stack);
  process.exit(1);
}
