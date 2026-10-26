# AMARÉL — Where Light Meets Living

AMARÉL is a responsive furniture and home décor storefront built with React, TypeScript, TanStack Start, Tailwind CSS, and Redux Toolkit. This frontend demo includes a cinematic lamp hero, light/dark themes, product discovery, individual product pages, favourites, a shopping cart, and a demo owner dashboard.

## Features

- Creamy ivory light theme and warm espresso dark theme, with the preference saved locally.
- Animated cinematic homepage with the descending pendant-lamp sequence.
- Shop-by-category, New Arrivals, and curated Best Sellers sections.
- Search, category filters, and sorting.
- Product details routes with image gallery, quantity selector, favourites, and related products.
- Redux-managed cart and catalogue/favourites state.
- Local persistence for the cart, catalogue demo data, favourites, and theme.
- Responsive navigation, cart drawer, search overlay, and reduced-motion support.
- Frontend-only owner dashboard and demo checkout; no real payments are processed.

## Run locally

Requirements: Node.js and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal.

## Build and test

```bash
npm run build
npm test
```

## Main technologies

- React + TypeScript
- TanStack Start / TanStack Router
- Redux Toolkit + React-Redux
- Tailwind CSS v4
- Lucide icons
- Sonner toast notifications

## Important demo limitations

This project is a frontend demonstration. Cart, favourites, theme, and catalogue changes are stored in the browser; they are not synced to a server. Checkout does not process payments, and the owner dashboard is not protected by production authentication. 