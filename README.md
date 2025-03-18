# TypeTourney - Real-Time Typing Race Application

A competitive typing application where users can race against each other in real-time typing competitions.

## Project Overview

Typo allows users to:

- Create and join typing race rooms
- Compete against other users in real-time
- Track typing speed and accuracy statistics

## Repository Structure

This repository contains both frontend and backend code:

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js with Express, Socket.IO, and TypeScript

## Frontend Setup

This project uses React with TypeScript and Vite for fast development experience.

### Available Plugins

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### ESLint Configuration

For production applications, enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively: ...tseslint.configs.strictTypeChecked,
    // Optional: ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

For React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```

## Backend Implementation

The backend provides:

- Real-time communication via Socket.IO
- Room management for typing races
- User tracking and race progress monitoring

For detailed backend implementation and architecture, see:
[Backend Code Repository](https://github.com/anounman/TypeTourney_backend) or refer to the `backend.md` file in this repository.

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. For production: `npm build` followed by `npm start`
