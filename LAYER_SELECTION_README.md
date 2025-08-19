# Layer Selection System

This project includes a comprehensive layer selection system that allows users to select states, cities, and layers from the GIS hierarchy API and load them on the map.

## 🏗️ Architecture

### Components

1. **`LayerSelectionContext`** - React Context for managing layer selections
2. **`LayerSelectionModal`** - Modal dialog for selecting layers
3. **`LayerSelectionButton`** - Button to open the modal
4. **`LayerStatusIndicator`** - Shows loading status and layer counts
5. **`useLayerLoader`** - Hook for loading selected layers

### Data Flow

```
User Selection → Context State → Layer Loader → Map Display
     ↓              ↓              ↓           ↓
Modal Input → Reducer → API Call → Layer Data
```

## 🎯 Features

### State Selection
- Dropdown to select from available states
- Automatically clears city selections when state changes
- Shows state information and available cities count

### City Group Selection
- Radio button selection for cities within selected state
- Each city shows available layers with checkboxes
- Users can select multiple layers per city
- Clear individual city selections

### Layer Management
- Checkbox selection for multiple layers
- Feature count display for each layer
- Automatic layer loading when selections change
- Layer status monitoring

### Context Management
- Persistent storage in localStorage
- Centralized state management
- Real-time updates across components
- Selection summary and statistics

## 🚀 Usage

### Opening the Modal
Click the "Select Layers" button in the top-right corner of the map.

### Selecting Layers
1. **Choose State**: Select a state from the dropdown
2. **Select Cities**: Click the radio button for desired cities
3. **Choose Layers**: Check the checkboxes for layers you want to load
4. **Apply**: Click "Apply Selection" to confirm

### Monitoring Status
- **Layer Status Indicator**: Shows in top-left corner when layers are selected
- **Button Badges**: Display selected city and layer counts
- **Loading States**: Visual feedback during API calls

## 🔧 Configuration

### Context Provider
Wrap your app with `LayerSelectionProvider`:

```tsx
import { LayerSelectionProvider } from '../contexts/LayerSelectionContext';

export default function RootLayout({ children }) {
  return (
    <LayerSelectionProvider>
      {children}
    </LayerSelectionProvider>
  );
}
```

### API Integration
Modify the `useLayerLoader` hook to call your actual layer loading API:

```tsx
// In useLayerLoader.ts
const response = await fetch('/api/layers', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    state: layerSelectionState.selectedData.state?.code,
    cityGroups: selectedLayers
  })
});
```

## 📊 Data Structure

### Selected Data Format
```typescript
interface SelectedLayerData {
  state: State | null;
  cityGroups: {
    [citySlug: string]: {
      city: City;
      selectedLayers: string[]; // Array of layer slugs
    };
  };
}
```

### Context State
```typescript
interface LayerSelectionState {
  selectedData: SelectedLayerData;
  isModalOpen: boolean;
}
```

## 🎨 Styling

The system uses Tailwind CSS with:
- **Modal**: Fixed positioning with backdrop overlay
- **Buttons**: Hover effects and loading states
- **Indicators**: Color-coded status messages
- **Responsive**: Mobile-friendly grid layouts

## 🔄 State Management

### Actions
- `SET_SELECTED_STATE` - Change selected state
- `TOGGLE_CITY_LAYER` - Toggle layer selection
- `CLEAR_CITY_LAYERS` - Clear city selections
- `CLEAR_ALL_SELECTIONS` - Reset all selections
- `SET_MODAL_OPEN` - Control modal visibility

### Persistence
- Selections automatically save to localStorage
- Restored on page refresh
- Maintains user preferences across sessions

## 🚦 Future Enhancements

1. **Bulk Operations**: Select all layers for a city/state
2. **Layer Filtering**: Search and filter available layers
3. **Layer Preview**: Show layer boundaries before loading
4. **Export Selections**: Save/load selection configurations
5. **Real-time Updates**: WebSocket for live layer status

## 🐛 Troubleshooting

### Common Issues
- **Modal not opening**: Check if context provider is wrapped
- **Selections not saving**: Verify localStorage is enabled
- **Layers not loading**: Check API endpoint configuration
- **State not updating**: Ensure reducer actions are correct

### Debug Mode
Enable console logging in `useLayerLoader`:
```tsx
console.log('Loading layers for:', selectedLayers);
```

## 📝 API Requirements

Your layer loading API should accept:
```json
{
  "state": "AP",
  "cityGroups": [
    {
      "city": { "slug": "hyderabad", "name": "Hyderabad" },
      "layers": ["master_plan", "roads"]
    }
  ]
}
```

And return layer data in GeoJSON format for map display. 