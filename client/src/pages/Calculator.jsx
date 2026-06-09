import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Car, Home, Salad, ShoppingBag, ArrowRight, ArrowLeft, CheckCircle, Calculator as CalcIcon } from 'lucide-react';
import calculateFootprint from '../utils/calculateFootprint';

export function Calculator({ onSaveResults }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [results, setResults] = useState(null);
  const [formData, setFormData] = useState({
    transport: {
      carKm: '',
      carFuel: 'none',
      bikeKm: '',
      bikeFuel: 'none',
      flightsDomestic: '',
      flightsIntl: '',
      publicHours: ''
    },
    energy: {
      electricityBill: '',
      cookingFuel: 'induction',
      lpgCylinders: '',
      householdSize: '1'
    },
    diet: {
      dietType: 'vegetarian',
      foodWaste: 'medium'
    },
    lifestyle: {
      shoppingOrders: '',
      streamingHours: '',
      singleUsePlastic: 'sometimes'
    }
  });

  const handleNestedChange = (category, field, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const computed = calculateFootprint(formData);
    setResults(computed);

    // Save results and form configuration to localStorage
    const historyEntry = {
      date: new Date().toISOString().split('T')[0],
      inputs: formData,
      results: computed
    };

    // Save to user history
    const existingHistory = JSON.parse(localStorage.getItem('ecoHistory') || '[]');
    existingHistory.push(historyEntry);
    localStorage.setItem('ecoHistory', JSON.stringify(existingHistory));

    // Save current active calculation results
    localStorage.setItem('ecoLatestResults', JSON.stringify(computed));
    localStorage.setItem('ecoLatestInputs', JSON.stringify(formData));

    // Callback to App state
    if (onSaveResults) {
      onSaveResults(computed);
    }
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  // Pie chart variables
  const chartData = results ? [
    { name: 'Transport', value: results.transport, color: '#2D6A4F' },
    { name: 'Home Energy', value: results.energy, color: '#40916C' },
    { name: 'Diet', value: results.diet, color: '#74C69D' },
    { name: 'Lifestyle', value: results.lifestyle, color: '#B7E4C7' }
  ].filter(item => item.value > 0) : [];

  return (
    <div className="max-w-4xl mx-auto px-4 pt-8 pb-20">
      {/* Header */}
      <div className="text-center mb-8">
        <CalcIcon className="w-10 h-10 text-[#2D6A4F] mx-auto mb-2" />
        <h1 className="text-3xl font-black text-[#1B2A1E]">Carbon Footprint Calculator</h1>
        <p className="text-gray-500 mt-2 text-sm">Measure your annual greenhouse gas footprint across key categories.</p>
      </div>

      {!results ? (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
          {/* Progress Bar Header */}
          <div className="bg-gray-50 border-b border-gray-100 p-6">
            <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              <span>Step {step} of 4</span>
              <span>
                {step === 1 && 'Transport Profile'}
                {step === 2 && 'Home Energy'}
                {step === 3 && 'Dietary Choices'}
                {step === 4 && 'Lifestyle Habits'}
              </span>
            </div>
            
            {/* Horizontal progress bar */}
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#2D6A4F] transition-all duration-300 ease-out"
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>

            {/* Stepper icons */}
            <div className="flex justify-between mt-4 px-2">
              {[1, 2, 3, 4].map(idx => (
                <div 
                  key={idx}
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 ${
                    step === idx 
                      ? 'bg-[#2D6A4F] text-white ring-4 ring-[#74C69D]/30' 
                      : step > idx 
                        ? 'bg-[#74C69D] text-white' 
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {idx === 1 && <Car className="w-4 h-4" />}
                  {idx === 2 && <Home className="w-4 h-4" />}
                  {idx === 3 && <Salad className="w-4 h-4" />}
                  {idx === 4 && <ShoppingBag className="w-4 h-4" />}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-8">
            
            {/* Step 1: Transport */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-[#1B2A1E] border-b pb-2 border-gray-100">Transportation Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="carKm" className="block text-sm font-bold text-gray-700 mb-2">Car usage (km / week)</label>
                    <input
                      id="carKm"
                      type="number"
                      placeholder="e.g. 150"
                      value={formData.transport.carKm}
                      onChange={e => handleNestedChange('transport', 'carKm', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-55 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                    />
                  </div>
                  <div>
                    <label htmlFor="carFuel" className="block text-sm font-bold text-gray-700 mb-2">Car fuel type</label>
                    <select
                      id="carFuel"
                      value={formData.transport.carFuel}
                      onChange={e => handleNestedChange('transport', 'carFuel', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-55 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                    >
                      <option value="none">No car / Don't use car</option>
                      <option value="petrol">Petrol</option>
                      <option value="diesel">Diesel</option>
                      <option value="electric">Electric (EV)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="bikeKm" className="block text-sm font-bold text-gray-700 mb-2">Two-wheeler usage (km / week)</label>
                    <input
                      id="bikeKm"
                      type="number"
                      placeholder="e.g. 80"
                      value={formData.transport.bikeKm}
                      onChange={e => handleNestedChange('transport', 'bikeKm', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-55 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                    />
                  </div>
                  <div>
                    <label htmlFor="bikeFuel" className="block text-sm font-bold text-gray-700 mb-2">Two-wheeler fuel type</label>
                    <select
                      id="bikeFuel"
                      value={formData.transport.bikeFuel}
                      onChange={e => handleNestedChange('transport', 'bikeFuel', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-55 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                    >
                      <option value="none">No two-wheeler / Don't use</option>
                      <option value="petrol">Petrol (Scooter/Bike)</option>
                      <option value="electric">Electric (e-scooter)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="flightsDomestic" className="block text-sm font-bold text-gray-700 mb-2">Domestic flights / year</label>
                    <input
                      id="flightsDomestic"
                      type="number"
                      placeholder="e.g. 2"
                      value={formData.transport.flightsDomestic}
                      onChange={e => handleNestedChange('transport', 'flightsDomestic', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-55 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                    />
                  </div>
                  <div>
                    <label htmlFor="flightsIntl" className="block text-sm font-bold text-gray-700 mb-2">International flights / year</label>
                    <input
                      id="flightsIntl"
                      type="number"
                      placeholder="e.g. 1"
                      value={formData.transport.flightsIntl}
                      onChange={e => handleNestedChange('transport', 'flightsIntl', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-55 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="publicHours" className="block text-sm font-bold text-gray-700 mb-2">Public Transport (Bus / Metro hours / week)</label>
                  <input
                    id="publicHours"
                    type="number"
                    placeholder="e.g. 5"
                    value={formData.transport.publicHours}
                    onChange={e => handleNestedChange('transport', 'publicHours', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-55 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Home Energy */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-[#1B2A1E] border-b pb-2 border-gray-100">Home Energy Consumption</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="electricityBill" className="block text-sm font-bold text-gray-700 mb-2">Monthly Electricity Bill (₹)</label>
                    <input
                      id="electricityBill"
                      type="number"
                      placeholder="e.g. 2500"
                      value={formData.energy.electricityBill}
                      onChange={e => handleNestedChange('energy', 'electricityBill', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-55 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                    />
                    <p className="text-xs text-gray-400 mt-1">Converted to kWh at average tariff rate of ₹7.00/kWh.</p>
                  </div>
                  <div>
                    <label htmlFor="householdSize" className="block text-sm font-bold text-gray-700 mb-2">Household Size (Number of members)</label>
                    <input
                      id="householdSize"
                      type="number"
                      min="1"
                      placeholder="e.g. 4"
                      value={formData.energy.householdSize}
                      onChange={e => handleNestedChange('energy', 'householdSize', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-55 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                    />
                    <p className="text-xs text-gray-400 mt-1">Divides shared home energy footprint to extract your individual per-capita emission.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="cookingFuel" className="block text-sm font-bold text-gray-700 mb-2">Primary Cooking Fuel</label>
                    <select
                      id="cookingFuel"
                      value={formData.energy.cookingFuel}
                      onChange={e => handleNestedChange('energy', 'cookingFuel', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-55 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                    >
                      <option value="induction">Induction (Electricity)</option>
                      <option value="lpg">LPG Cylinder</option>
                      <option value="png">PNG (Piped Natural Gas)</option>
                      <option value="none">No cooking / None</option>
                    </select>
                  </div>
                  {formData.energy.cookingFuel === 'lpg' && (
                    <div>
                      <label htmlFor="lpgCylinders" className="block text-sm font-bold text-gray-700 mb-2">LPG Cylinders used / month (household total)</label>
                      <input
                        id="lpgCylinders"
                        type="number"
                        step="0.1"
                        placeholder="e.g. 1.5"
                        value={formData.energy.lpgCylinders}
                        onChange={e => handleNestedChange('energy', 'lpgCylinders', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-55 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Diet */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-[#1B2A1E] border-b pb-2 border-gray-100">Dietary Habits</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="dietType" className="block text-sm font-bold text-gray-700 mb-2">Diet Profile</label>
                    <select
                      id="dietType"
                      value={formData.diet.dietType}
                      onChange={e => handleNestedChange('diet', 'dietType', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-55 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                    >
                      <option value="vegan">Vegan (No animal products)</option>
                      <option value="vegetarian">Vegetarian (Dairy, no meat/eggs)</option>
                      <option value="occasional_meat">Occasional Meat Eater (Poultry/Fish 1-2x/week)</option>
                      <option value="regular_meat">Regular Meat Eater (Meat 3x+ /week)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="foodWaste" className="block text-sm font-bold text-gray-700 mb-2">Food Waste Level</label>
                    <select
                      id="foodWaste"
                      value={formData.diet.foodWaste}
                      onChange={e => handleNestedChange('diet', 'foodWaste', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-55 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                    >
                      <option value="low">Low (Rarely throw away food)</option>
                      <option value="medium">Medium (Moderate household leftovers discarded)</option>
                      <option value="high">High (Frequent leftovers/spoiled food thrown away)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Lifestyle */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-[#1B2A1E] border-b pb-2 border-gray-100">Lifestyle & Purchasing</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="shoppingOrders" className="block text-sm font-bold text-gray-700 mb-2">Online Shopping orders / month</label>
                    <input
                      id="shoppingOrders"
                      type="number"
                      placeholder="e.g. 6"
                      value={formData.lifestyle.shoppingOrders}
                      onChange={e => handleNestedChange('lifestyle', 'shoppingOrders', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-55 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                    />
                  </div>
                  <div>
                    <label htmlFor="streamingHours" className="block text-sm font-bold text-gray-700 mb-2">Streaming hours / day</label>
                    <input
                      id="streamingHours"
                      type="number"
                      step="0.5"
                      placeholder="e.g. 2.5"
                      value={formData.lifestyle.streamingHours}
                      onChange={e => handleNestedChange('lifestyle', 'streamingHours', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-55 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                    />
                  </div>
                  <div>
                    <label htmlFor="singleUsePlastic" className="block text-sm font-bold text-gray-700 mb-2">Single-use Plastic usage</label>
                    <select
                      id="singleUsePlastic"
                      value={formData.lifestyle.singleUsePlastic}
                      onChange={e => handleNestedChange('lifestyle', 'singleUsePlastic', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-55 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                    >
                      <option value="rarely">Rarely (Eco-bags, glass/metal containers)</option>
                      <option value="sometimes">Sometimes (Polythenes/straws occasionally)</option>
                      <option value="often">Often (Bottled water, plastic packagings daily)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="mt-8 flex justify-between pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handlePrev}
                disabled={step === 1}
                className={`inline-flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-xl font-bold text-sm transition-colors cursor-pointer ${
                  step === 1 
                    ? 'opacity-40 cursor-not-allowed text-gray-400' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-[#2D6A4F] hover:bg-[#1B4332] text-white rounded-xl font-bold text-sm transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#74C69D]"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="inline-flex items-center space-x-2 px-8 py-3 bg-[#2D6A4F] hover:bg-[#1B4332] text-white rounded-xl font-bold text-sm transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#74C69D]"
                >
                  <span>Submit & Calculate</span>
                  <CheckCircle className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
        </div>
      ) : (
        /* Results Card and Charts */
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8 text-center space-y-8 animate-fade-in">
          <div>
            <div className="inline-flex items-center justify-center p-3 bg-[#74C69D]/20 text-[#2D6A4F] rounded-2xl mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-[#1B2A1E]">Calculation Complete!</h2>
            <p className="text-gray-500 text-sm mt-1">Here is your estimated annual carbon footprint.</p>
          </div>

          <div className="bg-gradient-to-br from-[#F8F9F0] to-[#E9F0EC] p-6 rounded-2xl border border-[#74C69D]/20 inline-block">
            <span className="block text-xs font-bold uppercase tracking-widest text-[#2D6A4F] mb-1">Your Carbon Footprint</span>
            <span className="font-mono text-4xl sm:text-5xl font-black text-[#1B2A1E]">
              {results.total.toLocaleString('en-IN')} <span className="text-lg font-bold text-gray-500">kg CO₂e/year</span>
            </span>
          </div>

          {/* Recharts Donut Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-4 border-t border-gray-100">
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value.toLocaleString('en-IN')} kg`, 'Emissions']}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Breakdown Table */}
            <div className="text-left space-y-4">
              <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wider">Emissions Breakdown</h3>
              <div className="space-y-3">
                {chartData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between border-b pb-2 border-gray-100">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-3.5 h-3.5 rounded-full inline-block" style={{ backgroundColor: item.color }}></span>
                      <span className="text-sm font-semibold text-gray-600">{item.name}</span>
                    </div>
                    <span className="font-mono text-sm font-bold text-[#1B2A1E]">
                      {item.value.toLocaleString('en-IN')} kg
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => setResults(null)}
              className="px-6 py-3 border border-gray-300 rounded-xl font-bold text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Recalculate
            </button>
            <button
              onClick={handleGoToDashboard}
              className="px-8 py-3 bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-sm rounded-xl transition-colors shadow-md cursor-pointer"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calculator;
