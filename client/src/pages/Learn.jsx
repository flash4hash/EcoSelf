import React, { useState } from 'react';
import { BookOpen, HelpCircle, ArrowRightLeft, Layers, ShieldAlert, Award } from 'lucide-react';

export function Learn() {
  const [activeScope, setActiveScope] = useState(1);
  const [openFaq, setOpenFaq] = useState(null);

  const scopeInfo = [
    {
      id: 1,
      title: 'Scope 1: Direct Emissions',
      desc: 'Emissions coming directly from assets you own or control.',
      examples: [
        'Burning petrol/diesel in your own car or two-wheeler.',
        'Combusting LPG gas directly in your kitchen stove.'
      ],
      color: 'bg-emerald-500'
    },
    {
      id: 2,
      title: 'Scope 2: Indirect (Purchased Energy)',
      desc: 'Emissions from electricity, steam, or cooling purchased and consumed by you.',
      examples: [
        'Grid electricity consumed to power your lights, fans, ACs, and induction cooktops.',
        'Charging electric scooters or vehicles from the local grid.'
      ],
      color: 'bg-teal-600'
    },
    {
      id: 3,
      title: 'Scope 3: Value Chain (All other indirect)',
      desc: 'Emissions occurring in the wider economy as a result of your purchases and lifestyle.',
      examples: [
        'Emissions from manufacturing and shipping products you buy online.',
        'Agricultural emissions related to producing, packing, and transporting the food you consume.'
      ],
      color: 'bg-indigo-600'
    }
  ];

  const comparisons = [
    { fact: '1 Domestic Flight', co2: '120 kg', equivalent: '6 months of running an LED light bulb at home' },
    { fact: '1 Petrol Car Commute (150 km/week)', co2: '1,404 kg / year', equivalent: 'Planting and nurturing 64 mature trees for a year' },
    { fact: '1 LPG Cylinder', co2: '43 kg', equivalent: 'Charging a typical electric scooter 1,000 times' },
    { fact: 'Switching to Veg Diet (3 days/week)', co2: '300 kg / year', equivalent: 'Avoiding 2.5 domestic flights in India' },
    { fact: 'Leaving AC on 24°C instead of 26°C', co2: '180 kg / year', equivalent: 'Shipping 120 online retail delivery packages' },
    { fact: '1 kg of Poultry Meat', co2: '6 kg', equivalent: 'Streaming video content on a device for 120 hours' },
    { fact: '1 Domestic Flight (Round Trip)', co2: '240 kg', equivalent: 'Using public transport for an entire year' },
    { fact: '1 Year of Daily Standby Power Waste', co2: '60 kg', equivalent: 'Making 40 online retail shipping orders' }
  ];

  const faqs = [
    {
      q: 'What is the Greenhouse Effect?',
      a: 'The greenhouse effect is a natural process where gases in the Earth\'s atmosphere (like carbon dioxide, methane, and water vapor) trap heat from the Sun, keeping our planet warm enough to sustain life. However, human industrial operations are injecting billions of kilograms of additional greenhouse gases into the atmosphere, causing global temperatures to rise rapidly.'
    },
    {
      q: 'What is the Paris Agreement?',
      a: 'The Paris Agreement is a legally binding international treaty on climate change. Adopted in 2015, its goal is to limit global warming to well below 2°C, preferably to 1.5°C, compared to pre-industrial levels. Nearly 200 nations, including India, have committed to reducing emissions to meet these targets.'
    },
    {
      q: 'What are Carbon Offsets?',
      a: 'Carbon offsetting is the practice of compensating for your greenhouse gas emissions by funding project operations that reduce or absorb carbon elsewhere. Examples include planting forests, restoring ecosystems, or installing renewable energy grids. Offsetting helps address emissions that cannot be directly avoided.'
    },
    {
      q: 'What does Net Zero mean?',
      a: 'Net Zero means achieving a state of balance between the greenhouse gases produced by human activities and the amount removed from the atmosphere. To limit catastrophic global warming, global emissions must fall to net zero by 2050. India has established a target to achieve net zero by 2070.'
    },
    {
      q: 'What are India\'s National Climate Goals?',
      a: 'India has committed to reducing the emissions intensity of its GDP by 45% by 2030 (from 2005 levels), achieving 50% cumulative electric power installed capacity from non-fossil fuel energy sources by 2030, and creating an additional carbon sink of 2.5 to 3 billion tonnes (2.5 - 3 trillion kg) of CO2 equivalent through forest cover.'
    },
    {
      q: 'Can an individual\'s choices make a real difference?',
      a: 'Yes. Household consumption drives over 60% of global greenhouse emissions. While systemic changes are critical, individual decisions—like reducing home electricity usage, taking public transport, choosing local plant-based foods, and composting—collectively signal market demand and immediately lower local carbon footprints.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 pt-8 pb-20 space-y-12">
      {/* Header */}
      <div className="text-center">
        <BookOpen className="w-10 h-10 text-[#2D6A4F] mx-auto mb-2" />
        <h1 className="text-3xl font-black text-[#1B2A1E]">Educational Hub</h1>
        <p className="text-gray-500 mt-2 text-sm">Understand the science, comparisons, and facts behind climate action.</p>
      </div>

      {/* Section A: Scope diagram */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center space-x-2.5 text-[#2D6A4F] mb-2">
          <Layers className="w-6 h-6" />
          <h2 className="text-xl font-bold text-[#1B2A1E]">What is a Carbon Footprint?</h2>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed">
          A carbon footprint represents the total greenhouse gas emissions (including carbon dioxide and methane) generated by our actions. Globally, emissions are classified into three "Scopes" to help categorize direct and indirect impacts.
        </p>

        {/* Info Banner */}
        <div className="bg-[#F8F9F0] border border-[#74C69D]/30 p-4 rounded-xl text-sm text-gray-700">
          <strong>India Context:</strong> India emits approximately <strong>2,900,000,000,000 kg</strong> (2.9 trillion kg) of $CO_2$ annually. While our per-capita emission is low (~1,900 kg/year compared to the global average of ~4,700 kg/year), our total national emissions are growing as development accelerates.
        </div>

        {/* Interactive Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          {scopeInfo.map(scope => (
            <button
              key={scope.id}
              onClick={() => setActiveScope(scope.id)}
              className={`p-5 rounded-2xl border text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#74C69D] cursor-pointer ${
                activeScope === scope.id
                  ? 'border-[#2D6A4F] bg-[#2D6A4F]/5 shadow-md ring-1 ring-[#2D6A4F]'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <span className={`w-3 h-3 rounded-full ${scope.color}`}></span>
                <h3 className="font-bold text-sm text-gray-800">{scope.title.split(':')[0]}</h3>
              </div>
              <h4 className="font-semibold text-xs text-gray-500 mt-1">{scope.title.split(':')[1]}</h4>
            </button>
          ))}
        </div>

        {/* Selected Scope details */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 transition-all duration-300">
          <h3 className="font-bold text-sm text-gray-800">{scopeInfo[activeScope - 1].title}</h3>
          <p className="text-xs text-gray-500 mt-1">{scopeInfo[activeScope - 1].desc}</p>
          <div className="mt-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Typical Personal Examples:</h4>
            <ul className="list-disc pl-5 text-xs text-gray-600 space-y-1">
              {scopeInfo[activeScope - 1].examples.map((ex, idx) => (
                <li key={idx}>{ex}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Section B: Comparison facts */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2.5 text-[#2D6A4F]">
          <ArrowRightLeft className="w-6 h-6" />
          <h2 className="text-xl font-bold text-[#1B2A1E]">How Your Choices Add Up</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {comparisons.map((item, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">{item.fact}</span>
              <div className="my-4">
                <span className="font-mono text-2xl font-black text-[#2D6A4F]">{item.co2}</span>
                <span className="text-xs font-bold text-gray-400 block mt-0.5">Carbon Footprint</span>
              </div>
              <div className="text-xs text-gray-600 border-t pt-3 border-gray-100">
                <span className="font-bold text-[#1B2A1E]">Equivalent to:</span> {item.equivalent}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section C: FAQ Accordion */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center space-x-2.5 text-[#2D6A4F] mb-2">
          <HelpCircle className="w-6 h-6" />
          <h2 className="text-xl font-bold text-[#1B2A1E]">Climate Science in 3 Minutes</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="border border-gray-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 text-left font-bold text-sm text-gray-800 focus:outline-none focus:bg-gray-50 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
                
                {isOpen && (
                  <div className="p-4 bg-white border-t border-gray-100 text-xs text-gray-600 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Learn;
