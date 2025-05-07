# DriverFly Frontend

> Next.js-based web application for DriverFly platform

## Overview

DriverFly is a modern web application built with Next.js, React, and TypeScript, providing a robust frontend solution for the DriverFly platform.

## Prerequisites

- Node.js v20.11.0 (recommended to use [NVM](https://github.com/nvm-sh/nvm))
- npm (Node Package Manager)

## Quick Start

1. Clone the repository:
   ```bash
   git clone https://gitlab.com/d5968/driverfly-frontend.git
   cd driverfly-frontend
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

   > **IMPORTANT**: The `--legacy-peer-deps` flag is required due to dependency compatibility issues.

3. Copy environment file and update configuration

    cp .env.example .env

   Configure the following environment variables:
   - `BASE_URL` - Frontend application URL
   - `BASE_URL_API` - Backend API URL
   - `FRONTEND_BASE_URL` - Frontend URL for sharing
   - `MAPBOX_API_KEY` - Mapbox API key
   - `RECAPTCHA_SITE_KEY` - Google reCAPTCHA key

4. Start development server:
   ```bash
   npm run dev
   ```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Run production build |
| `npm run lint` | Run ESLint |

## Tech Stack

- **Core**: Next.js 12, React, TypeScript
- **UI/UX**: 
  - React Bootstrap
  - Material UI
  - React Toastify
- **Forms**: Formik, Yup
- **Data Visualization**: Chart.js, ApexCharts
- **API**: Axios
- **Real-time**: Socket.IO Client
- **PDF**: React PDF Renderer
- **Communication**: Twilio Client
- **Styling**: SASS

## Project Structure

```
├── components/     # Reusable UI components
├── context/       # React context providers
├── hooks/         # Custom React hooks
├── pages/         # Next.js pages
├── public/        # Static assets
├── styles/        # SASS stylesheets
├── types/         # TypeScript types
├── utils/         # Utility functions
├── models/        # Data models
├── enums/         # Enumeration types
├── config/        # Configuration
└── logics/        # Business logic
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment

The application can be deployed to any Next.js-compatible hosting service. A `netlify.toml` configuration is included for Netlify deployments.

## Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
