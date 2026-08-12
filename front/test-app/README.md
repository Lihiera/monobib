# Monobib Frontend

Monobib Frontend is the React/Vite client for [Monobib](https://github.com/Lihiera/monobib), a restaurant discovery application using Tabelog and Michelin data.

It is deployed to GitHub Pages and uses the Mono Back API deployed on Render.

## Deployment

- Frontend: `https://lihiera.github.io/monobib/`
- Search page: `https://lihiera.github.io/monobib/#/search`
- API: `https://mono-back.onrender.com`

The app uses `HashRouter` so direct links and page refreshes work reliably on GitHub Pages.

## Features

- Browse restaurants by region and source
- View paginated restaurant results
- View restaurant locations on a map
- Open original restaurant pages from Tabelog or Michelin

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy

```bash
npm run deploy
```

The production build is generated in `dist`.
