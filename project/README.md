# Options Trading PnL Dashboard

A comprehensive portfolio Profit and Loss (PnL) dashboard for options trading, built with React and Node.js by Yashas Gunderia

## Features

- Real-time portfolio value and PnL tracking
- Detailed options positions table
- Interactive performance charts
- WebSocket integration for live updates
- Modern, responsive UI with dark theme
- Production-ready code structure built and designed by Yashas
-COMING: TRADE REAL TIME , COMPLETE KYC AND REGISTER WITH OUR PLATFORM AND TRACK YOUR TRADES REAL TIME, FASTER WITH MARKETDATA APP INTEGRATION.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Visual Studio Code (recommended)

## Project Setup

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd options-trading-pnl-dashboard
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Add your brokerage API credentials

4. Start the development servers:
\`\`\`bash
npm run dev:all
\`\`\`

This will start both the frontend (Vite) and backend (Express) servers.

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Project Structure

\`\`\`
├── src/                  # Frontend source code
│   ├── components/       # React components
│   ├── services/        # API services
│   ├── types/           # TypeScript types
│   └── App.tsx          # Main application component
├── server/              # Backend source code
│   └── index.js         # Express server setup
├── .env                 # Environment variables
└── package.json         # Project dependencies
\`\`\`

## Development

### Frontend (React + TypeScript)

- Located in `src/` directory
- Uses React Query for data fetching
- Real-time updates via WebSocket
- Styled with Tailwind CSS

### Backend (Node.js + Express)

- Located in `server/` directory
- RESTful API endpoints
- WebSocket server for real-time updates
- Sample data generation (replace with actual brokerage API)

## Extending the Project

### Adding New Features

1. Frontend Components:
   - Add new components in `src/components/`
   - Update types in `src/types/`
   - Add new API services in `src/services/`

2. Backend Endpoints:
   - Add new routes in `server/index.js`
   - Implement new WebSocket events as needed

### Brokerage API Integration

Replace the sample data in `server/index.js` with actual API calls:

1. Add your API credentials to `.env`
2. Create API service functions
3. Update the endpoints to use real data
4. Implement proper error handling

## Testing

Coming soon:
- Frontend tests with Jest and React Testing Library
- Backend API tests
- Integration tests
-Im working on complete integration of auth system and hosting to make this run and setup a demat account get the api and then it will be a platform where users can register officialy and trade , they will need to do KYC, integrating that system is easy, I have done it before.

## Credits 

Yashas Gunderia