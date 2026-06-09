const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config({ path: require('path').resolve(__dirname, '../.env') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// Helper to call Gemini API via fetch
async function callGemini(prompt, systemInstruction = '') {
  if (!GEMINI_API_KEY || GEMINI_API_KEY.trim() === '') {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const payload = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  };

  if (systemInstruction) {
    payload.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
    return data.candidates[0].content.parts[0].text;
  }
  throw new Error('Invalid response structure from Gemini API');
}

// Feature 1 — AI Eco Advisor
// POST /api/ai/advice
router.post('/advice', async (req, res) => {
  const { transport, home, diet, lifestyle, total } = req.body;

  const prompt = `User in India has annual carbon footprint of ${total} kg CO2e. Breakdown: transport ${transport} kg, home energy ${home} kg, diet ${diet} kg, lifestyle ${lifestyle} kg. Give exactly 3 specific, actionable, India-relevant tips to reduce their footprint. Each tip in one sentence. Format: numbered list.`;

  try {
    const aiText = await callGemini(prompt);
    res.json({ advice: aiText });
  } catch (error) {
    console.warn('AI Advisor call failed, using static fallback:', error.message);
    
    // Quality fallback response
    const fallbackAdvice = `1. Opt for public transport like the Delhi Metro, Mumbai local, or carpool with colleagues to reduce your transport emissions.
2. Switch to 5-star energy-efficient LED bulbs at home and turn off cooking gas regulators and appliances at the wall when not in use.
3. Incorporate more local millets (like ragi or jowar) and seasonal vegetables into your meals while keeping food waste to an absolute minimum.`;
    
    res.json({ advice: fallbackAdvice });
  }
});

// Feature 2 — Smart Action Recommender
// POST /api/ai/recommend
router.post('/recommend', async (req, res) => {
  const { transport, home, diet, lifestyle, completed, actionsList } = req.body;

  // actionsList is expected to be an array of objects: { id, title, savedCo2 }
  const completedStr = (completed || []).join(', ');
  const actionsListStr = (actionsList || [])
    .map(a => `ID: ${a.id} (Title: "${a.title}", Saved: ${a.savedCo2} kg/month, Category: ${a.category})`)
    .join('\n');

  const prompt = `User's carbon breakdown: transport ${transport} kg, home ${home} kg, diet ${diet} kg, lifestyle ${lifestyle} kg. They have already completed these actions: [${completedStr}]. From this list of available actions:\n${actionsListStr}\nrecommend the 5 highest-impact actions they should do next. Return only a JSON array of action IDs. Example format: [1, 5, 8, 12, 15]`;

  try {
    const aiText = await callGemini(prompt, "You are a JSON assistant. You must output only a valid JSON array of numbers, with no markdown formatting or explanations.");
    
    // Clean potential markdown backticks if Gemini ignores system instructions
    const cleanedJson = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
    const recommendedIds = JSON.parse(cleanedJson);
    
    if (Array.isArray(recommendedIds)) {
      res.json({ recommendations: recommendedIds });
    } else {
      throw new Error('Gemini did not return an array');
    }
  } catch (error) {
    console.warn('AI Recommender call failed, using static fallback:', error.message);
    
    // Quality fallback logic: pick top 5 high impact actions not yet completed
    const allActions = actionsList || [];
    const completedSet = new Set(completed || []);
    const remainingActions = allActions.filter(a => !completedSet.has(a.id));
    
    // Sort by saved CO2 descending
    remainingActions.sort((a, b) => b.savedCo2 - a.savedCo2);
    
    // Take top 5 IDs
    const fallbackIds = remainingActions.slice(0, 5).map(a => a.id);
    res.json({ recommendations: fallbackIds });
  }
});

// Feature 3 — CO₂ Quick Estimator Chatbot
// POST /api/ai/chat
router.post('/chat', async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const systemPrompt = "You are EcoBot, a carbon footprint assistant for Indian users. Answer only questions about carbon emissions, sustainability, and eco-friendly choices. Keep answers under 60 words. Always give a specific number in kg CO2e when relevant. If asked anything unrelated to carbon footprint or sustainability, politely redirect the user back to eco topics.";

  try {
    if (!GEMINI_API_KEY || GEMINI_API_KEY.trim() === '') {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    // Format chat contents according to Gemini API specs
    const contents = [];
    if (history && Array.isArray(history)) {
      // Keep only last 3 turns
      const recentHistory = history.slice(-3);
      recentHistory.forEach(turn => {
        contents.push({
          role: turn.sender === 'user' ? 'user' : 'model',
          parts: [{ text: turn.text }]
        });
      });
    }
    
    // Add current message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const payload = {
      contents: contents,
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      }
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
      const reply = data.candidates[0].content.parts[0].text;
      res.json({ reply: reply });
    } else {
      throw new Error('Invalid response structure from Gemini API');
    }
  } catch (error) {
    console.warn('AI Chatbot call failed, using static fallback:', error.message);
    
    // Check if user is asking about sustainability topics and reply accordingly
    const lowerMsg = message.toLowerCase();
    let reply = "I'm having trouble connecting, but here's a tip: Using a reusable water bottle saves about 10 kg CO2e annually compared to plastic!";
    
    if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
      reply = "Hello! I am EcoBot. Ask me about carbon emissions of foods, transport, or energy, and I will help you estimate the CO2 impact.";
    } else if (lowerMsg.includes('chicken') || lowerMsg.includes('meat') || lowerMsg.includes('food')) {
      reply = "Producing 1 kg of poultry emissions yields about 6 kg CO2e. Choosing plant proteins like lentils or beans reduces emissions to less than 1 kg CO2e per kg. Making the switch can save you over 150 kg CO2e annually!";
    } else if (lowerMsg.includes('flight') || lowerMsg.includes('train') || lowerMsg.includes('mumbai') || lowerMsg.includes('delhi')) {
      reply = "A direct flight from Mumbai to Delhi emits about 120 kg CO2e per passenger. Taking a train for the same journey emits only 15 kg CO2e, saving about 105 kg CO2e of carbon footprint!";
    } else if (lowerMsg.includes('car') || lowerMsg.includes('metro') || lowerMsg.includes('bus')) {
      reply = "Driving a petrol car for 10 km emits roughly 1.8 kg CO2e. Taking a modern metro system instead emits only 0.2 kg CO2e, which reduces emissions by 88% per trip!";
    } else if (!lowerMsg.includes('carbon') && !lowerMsg.includes('footprint') && !lowerMsg.includes('sustainability') && !lowerMsg.includes('eco') && !lowerMsg.includes('emission') && !lowerMsg.includes('plant') && !lowerMsg.includes('recycle') && !lowerMsg.includes('green')) {
      reply = "I am EcoBot, your sustainability assistant. I can only answer questions related to carbon emissions, global warming, or eco-friendly choices. Let me know how I can help you save emissions today!";
    }
    
    res.json({ reply });
  }
});

// Feature 4 — Weekly Eco Report Generator
// POST /api/ai/report
router.post('/report', async (req, res) => {
  const { data, actions } = req.body;

  const prompt = `Generate a 3-paragraph personal sustainability report for an Indian user. Week-by-week footprint: ${JSON.stringify(data)}. Completed eco-actions: ${JSON.stringify(actions)}. Para 1: what they're doing well. Para 2: biggest opportunity for improvement. Para 3: one inspiring fact about collective impact if 1 million Indians did the same. Keep total under 200 words. Friendly, non-preachy tone.`;

  try {
    const aiText = await callGemini(prompt);
    res.json({ report: aiText });
  } catch (error) {
    console.warn('AI Report call failed, using static fallback:', error.message);
    
    const fallbackReport = `Great job on taking active steps to lower your carbon footprint this week! By committing to energy-efficient habits like using public transport and air-drying your laundry, you are demonstrating that conscious daily decisions lead to significant long-term carbon reductions.

Your biggest opportunity for improvement lies in optimizing home energy. Heating water and running air conditioning represent major chunks of electricity consumption in India. Adjusting your thermostat up by 2°C or reducing water-heating usage can save up to 180 kg CO2e per year.

Did you know? If 1 million Indian households switched to LED lighting and unplugged standby devices, we would collectively offset over 150 million kg of carbon emissions annually, enough to light up thousands of rural homes sustainably.`;

    res.json({ report: fallbackReport });
  }
});

module.exports = router;
