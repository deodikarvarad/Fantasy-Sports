# Fantasy Sports App

A React.js web application for creating and managing fantasy sports teams.

## Features

- **Upcoming Matches**: Browse and select from upcoming matches
- **Team Creation**: Create multiple teams per match with 11 players
- **Player Selection**: Filter players by role, team, and credits
- **Team Validation**: 
  - Maximum 7 players from one team
  - Total of 11 players
  - 100 credits per team
  - Role restrictions (3-7 Batsman, 1-5 Wicket Keepers, 0-4 All Rounders, 3-7 Bowlers)
- **Captain & Vice-Captain**: Assign captain and vice-captain to your team
- **Team Management**: View, edit, and delete your created teams

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Tech Stack

- React 18
- React Router DOM
- Vite
- Tailwind CSS
- Local Storage (for team persistence)

## Project Structure

```
src/
├── components/     # Reusable components
├── pages/         # Page components
├── services/      # API services
├── utils/         # Utility functions
└── App.jsx        # Main app component
```

## Pages

1. **Upcoming Matches** (`/matches`) - List all upcoming matches
2. **Pick Players** (`/pick-players/:matchId`) - Select 11 players for your team
3. **Pick Captain** (`/pick-captain/:matchId/:teamId`) - Assign captain and vice-captain
4. **My Teams** (`/my-teams/:matchId`) - View and manage your teams

## API Endpoints

- Get all upcoming matches: `https://leaguex.s3.ap-south-1.amazonaws.com/task/fantasy-sports/Get_All_upcoming_Matches.json`
- Get all players: `https://leaguex.s3.ap-south-1.amazonaws.com/task/fantasy-sports/Get_All_Players_of_match.json`
