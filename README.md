# India GIS Hierarchy Map with Leaflet

This is a [Next.js](https://nextjs.org) project that displays an interactive map of India using Leaflet, with support for multiple GIS layers and hierarchical data selection.

## Features

- **Interactive Leaflet Map**: Built with react-leaflet for smooth map interactions
- **Multi-Layer Support**: Display multiple GIS tile layers simultaneously
- **Hierarchical Data Selection**: Select states, cities, and specific layers
- **Real-time Layer Management**: Add/remove layers dynamically based on user selection
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Dependencies

- **Leaflet**: Open-source JavaScript library for interactive maps
- **react-leaflet**: React components for Leaflet maps
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe JavaScript development

## Map Layers

The application supports custom GIS tile layers from the 1acre.in API:
- Base OpenStreetMap tiles for reference
- Custom GIS layers for different data types
- Dynamic layer management based on user selection

## Architecture

- **LeafletMap.tsx**: Main wrapper component with dynamic imports
- **LeafletMapInner.tsx**: Core map component with layer management
- **LayerSelectionContext.tsx**: State management for layer selection
- **MapContainer.tsx**: Container component that orchestrates the map and UI

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
