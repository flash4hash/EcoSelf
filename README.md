# EcoSelf 🌱

EcoSelf is a comprehensive, AI-powered Carbon Footprint Awareness Platform designed specifically for individual users in India. The application helps users understand, track, and actively reduce their personal carbon footprint through simple everyday actions, local insights, community pledges, and AI-driven recommendations.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (Tested on Node.js v24.13.0)
- **NPM**: v9 or higher

### 2. Installation
To install dependencies for the root, client, and server, run the following command from the root `ecoself` directory:
```bash
npm run install-all
```

### 3. Setting up the Gemini API Key
To enable the AI Eco Advisor, Smart Action Recommender, EcoBot Chatbot, and Weekly Eco Report Generator:
1. Go to [Google AI Studio](https://aistudio.google.com/) and sign in with your Google account.
2. Click on **Get API Key** and create a new API key.
3. In the `/server` folder, copy `.env.example` to `.env`:
   ```bash
   cp server/.env.example server/.env
   ```
4. Edit `server/.env` and paste your Gemini API key:
   ```env
   PORT=5000
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

### 4. Running the Application
To run the server and client concurrently in development mode, run:
```bash
npm run dev
```
- **Frontend** runs on: `http://localhost:5173`
- **Backend API** runs on: `http://localhost:5000`

---

## 🧮 Carbon Footprint Calculation Methodology

All calculations are executed in kilograms of $CO_2$ equivalent ($kg\ CO_2e$) per year to maximize psychological immediacy and drive behavioural change.

### Emission Factors (Based on IPCC AR6 & Central Electricity Authority India)

1. **Transport**:
   - **Petrol Car**: $0.18\ kg\ CO_2e/km$
   - **Diesel Car**: $0.20\ kg\ CO_2e/km$
   - **Electric Car**: $0.10\ kg\ CO_2e/km$ (reflections of coal-heavy Indian power grid)
   - **Petrol Two-wheeler**: $0.08\ kg\ CO_2e/km$
   - **Electric Two-wheeler**: $0.04\ kg\ CO_2e/km$
   - **Domestic Flights**: $0.12\ kg\ CO_2e/km$ (assumed average ~1,000 km per trip)
   - **International Flights**: $0.11\ kg\ CO_2e/km$ (assumed average ~4,000 km per trip)
   - **Public Transport (Bus/Metro)**: $0.05\ kg\ CO_2e/hour$

2. **Home Energy**:
   - **Electricity**: $0.82\ kg\ CO_2e/kWh$ (Source: Central Electricity Authority of India - CO2 Baseline Database for the Indian Power Sector).
     - *Formula*: $kWh/year = (\text{Monthly Bill in } \text{INR} \div \text{INR } 7.00\text{ average rate}) \times 12$
     - *Per Capita Split*: The total energy footprint of the household is divided by the household size to obtain the user's per-capita emission.
   - **LPG Cooking Gas**: $42.5\ kg\ CO_2e/cylinder$ (14.2 kg cylinder at $3.0\ kg\ CO_2e$ per kg LPG)
   - **PNG**: $20.0\ kg\ CO_2e/month$ (average cooking emissions)
   - **Induction**: Modeled via electricity consumption ($10.0\ kg\ CO_2e/month$ per capita equivalent)

3. **Diet**:
   - **Vegan**: $1,000\ kg\ CO_2e/year$
   - **Vegetarian**: $1,400\ kg\ CO_2e/year$
   - **Occasional Meat**: $2,000\ kg\ CO_2e/year$
   - **Regular Meat**: $2,800\ kg\ CO_2e/year$
   - **Food Waste**: Low ($50\ kg$), Medium ($150\ kg$), High ($300\ kg$) per year.

4. **Lifestyle**:
   - **Online Shopping**: $1.5\ kg\ CO_2e/order$ (packaging, logistics, and delivery)
   - **Streaming**: $0.05\ kg\ CO_2e/hour$ (data centre and transmission overheads)
   - **Single-use Plastics**: Rarely ($10\ kg$), Sometimes ($30\ kg$), Often ($80\ kg$) per year.

---

## 🛡️ Database & Security Features
- **Database Safety Fallback**: Primarily attempts to use `better-sqlite3`. If installation fails on Windows, it catches the error and stores data in a thread-safe, in-memory JS store, preventing server crashes.
- **XSS Protection**: Submissions to the Community Pledge Wall are stripped of all HTML tag structures (`replace(/<[^>]*>/g, '')`) and trimmed, ensuring safe rendering.
- **API Guardrails**: The chatbot system prompt is hardcoded to redirect user messages strictly back to sustainability and carbon footprint topics if off-topic requests are detected.
