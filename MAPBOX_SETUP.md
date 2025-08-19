# Mapbox Map Component Setup

This project includes a Mapbox map component with satellite view. Here's how to set it up:

## Prerequisites

1. **Mapbox Account**: You need a Mapbox account to get an access token
   - Sign up at [mapbox.com](https://mapbox.com)
   - Navigate to your account dashboard
   - Create a new access token or use the default public token

## Setup Steps

### 1. Environment Variables

Create a `.env.local` file in your project root and add your Mapbox access token:

```bash
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_actual_mapbox_token_here
```

### 2. Dependencies

The required packages are already installed:
- `mapbox-gl` - Mapbox GL JS library
- `@types/mapbox-gl` - TypeScript types

### 3. Component Structure

- **`MapboxMap.tsx`** - Client component that renders the actual map
- **`MapContainer.tsx`** - Server component wrapper for data fetching and layout
- **`page.tsx`** - Updated main page that uses the map

## Features

The map component includes:
- Satellite view with roads and labels by default (`mapbox://styles/mapbox/satellite-streets-v12`)
- Navigation controls (zoom, pan, rotate)
- Fullscreen control
- Geolocation control
- Responsive design
- TypeScript support

## Customization

You can customize the map by passing props:

```tsx
<MapContainer 
  center={[-74.5, 40]} // [longitude, latitude]
  zoom={9}             // Zoom level (0-22)
  className="w-full h-screen" // CSS classes
/>
```

## Available Map Styles

- Satellite with Roads: `mapbox://styles/mapbox/satellite-streets-v12` (current default)
- Satellite Only: `mapbox://styles/mapbox/satellite-v9`
- Streets: `mapbox://styles/mapbox/streets-v12`
- Outdoors: `mapbox://styles/mapbox/outdoors-v12`
- Light: `mapbox://styles/mapbox/light-v11`
- Dark: `mapbox://styles/mapbox/dark-v11`

## Troubleshooting

- **Map not loading**: Check your access token in `.env.local`
- **TypeScript errors**: Ensure `@types/mapbox-gl` is installed
- **Build errors**: Make sure the environment variable is prefixed with `NEXT_PUBLIC_`

## Security Note

The access token is exposed to the client since it's prefixed with `NEXT_PUBLIC_`. This is normal for Mapbox public tokens, but ensure you're using the appropriate token type for your use case. 