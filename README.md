
> ### Driverfly NestJS frontend codebase

---

## Installation

Ensure you have node 20.11.0+ and npm 10.8.2+
    
Install dependencies with legacy peer deps

    npm install --force --legacy-peer-deps

Copy environment file and update configuration

    cp .env.example .env

Update the following in your .env file:
- `BASE_URL` - Frontend application URL (for open gateway)
- `BASE_URL_API` - Backend application URL (for API calls)
- `FRONTEND_BASE_URL` - Frontend application URL (for sharing links)
- `MAPBOX_API_KEY` - Mapbox API key (for mapbox maps)
- `RECAPTCHA_SITE_KEY` - Recaptcha site key (for recaptcha)


##  Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start in watch mode (development) |
| `npm run build` | Build production build |
| `npm run start` | Start production build |
| `npm run lint` | Run lint |

##  Additional Resources

- [NextJS Documentation](https://nextjs.org/docs)
