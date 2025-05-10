# DriverFly Frontend

## Overview

DriverFly is a Next.js-based web application built with React and TypeScript. This repository contains the frontend codebase for the DriverFly application.

## Prerequisites

- Node.js v17.9.0 (recommended to use [NVM](https://github.com/nvm-sh/nvm) for Node.js version management)
- npm (Node Package Manager)

## Installation

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

3. Create a `.env` file in the root directory with the following environment variables:

   ```
   BASE_URL=<your-base-url>
   FRONTEND_BASE_URL=<your-frontend-base-url>
   BASE_URL_API=<your-api-url>
   MAPBOX_API_KEY=<your-mapbox-api-key>
   TWILIO_APP_NAME=<your-twilio-app-name>
   PHONE_INPUT_COUNTRY_ALLOWED=<allowed-countries>
   RECAPTCHA_SECRET_KEY=<your-recaptcha-secret>
   RECAPTCHA_SITE_KEY=<your-recaptcha-site-key>
   NEXT_PUBLIC_MICROSOFT_CLARITY=<your-clarity-id>
   ```

4. Create a reCAPTCHA account and get the secret and site keys. https://cloud.google.com/recaptcha/docs/create-key-website. Add the site key and secret key to the `.env` file.

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Building for Production

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Linting

Check code quality:

```bash
npm run lint
```

## Technologies Used

- **Framework**: Next.js 12
- **UI Libraries**:
  - React Bootstrap
  - Material UI
  - React Toastify
- **Form Handling**: Formik, Yup
- **Styling**: SASS
- **Data Visualization**: Chart.js, ApexCharts
- **HTTP Client**: Axios
- **Other Notable Packages**:
  - React Signature Canvas
  - React PDF Renderer
  - Socket.IO Client
  - Twilio Client

## Project Structure

- `components/` - Reusable UI components
- `context/` - React context providers
- `hooks/` - Custom React hooks
- `pages/` - Next.js pages and routing
- `public/` - Static assets
- `styles/` - SASS stylesheets
- `types/` - TypeScript type definitions
- `utils/` - Utility functions
- `models/` - Data models
- `enums/` - Enumeration types
- `config/` - Configuration files
- `logics/` - Business logic

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment

This project can be deployed using Netlify or any other Next.js-compatible hosting service. A `netlify.toml` configuration file is included for Netlify deployments.
