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

4. Create a reCAPTCHA account and get the secret and site keys. https://cloud.google.com/recaptcha/docs/create-key-website. Add the site key and secret key to the `.env` file. Ensure the site key is also in the backend .env file.

5. Create a MapBox account and get the API key. https://www.mapbox.com/. Add the API key to the `.env` file.

## Development

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Create production build  |
| `npm run start` | Run production build     |
| `npm run lint`  | Run ESLint               |

## Tech Stack

## Available Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Create production build  |
| `npm run start` | Run production build     |
| `npm run lint`  | Run ESLint               |

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

The application can be deployed to any Next.js-compatible hosting service.

### Deploying Next.js App to Netlify from GitLab

A `netlify.toml` configuration is included for Netlify deployments. You can easily deploy your Next.js app on Netlify using your GitLab repository by following these steps:

#### 1. Connect GitLab with Netlify

1. Go to [https://app.netlify.com/](https://app.netlify.com/) and sign in.
2. Click on “Add new site” → “Import an existing project”.
3. Choose GitLab as the Git provider.
4. Authorize Netlify to access your GitLab account.
5. Select the repository where your Next.js project resides.

#### 2. Configure Build Settings

When prompted, set the following:

- **Branch to deploy**: main (or your desired branch)
- **Build command**:
  ```bash
  npm run build
  ```
- **Publish directory**:  
  For a standard Next.js app, use:
  ```
  .next
  ```

You also need to set environment variables:

- For example:
  - `NODE_VERSION=20`
  - `NPM_FLAGS=--legacy-peer-deps`
  - All other environment variables from `.env.example`

#### 3. Click “Deploy Site”

Netlify will clone your GitLab repository, install dependencies, and build your site. Once complete, your Next.js app will be live on a Netlify domain (which you can customize).

## Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Netlify Documentation](https://www.netlify.com/docs)
- [Lovable Mockup](https://preview--fleet-savvy-track.lovable.app/)
