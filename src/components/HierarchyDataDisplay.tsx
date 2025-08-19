'use client';

import { useHierarchy } from '../hooks/useHierarchy';

export default function HierarchyDataDisplay() {
  const { data, loading, error, getAllCities, getTotalStatistics } = useHierarchy();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Data</h2>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-yellow-800">No Data Available</h2>
        <p className="text-yellow-600">No hierarchy data was found.</p>
      </div>
    );
  }

  const totalStats = getTotalStatistics();
  const allCities = getAllCities();

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Hierarchy Data Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{totalStats?.totalStates || 0}</div>
            <div className="text-sm text-gray-600 font-medium">Total States</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{totalStats?.totalCities || 0}</div>
            <div className="text-sm text-gray-600 font-medium">Total Cities</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{totalStats?.totalLayers || 0}</div>
            <div className="text-sm text-gray-600 font-medium">Total Layers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {totalStats?.totalFeatures ? totalStats.totalFeatures.toLocaleString() : 0}
            </div>
            <div className="text-sm text-gray-600 font-medium">Total Features</div>
          </div>
        </div>
      </div>

      {/* API Response Details */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">API Response Details</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="font-medium text-gray-700">API Status:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              data.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {data.status}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="font-medium text-gray-700">Total States:</span>
            <span className="text-gray-900 font-semibold">{data.total_states}</span>
          </div>
        </div>
      </div>

      {/* States and Cities Breakdown */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">States & Cities Breakdown</h3>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {data.hierarchy.map((stateData) => (
            <div key={stateData.state.code} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-900">
                  {stateData.state.name} ({stateData.state.code})
                </h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  stateData.state.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {stateData.state.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="font-semibold text-blue-600">{stateData.statistics.total_cities}</div>
                  <div className="text-blue-600">Cities</div>
                </div>
                <div className="text-center p-2 bg-purple-50 rounded">
                  <div className="font-semibold text-purple-600">{stateData.statistics.total_layers}</div>
                  <div className="text-purple-600">Layers</div>
                </div>
                <div className="text-center p-2 bg-orange-50 rounded">
                  <div className="font-semibold text-orange-600">
                    {stateData.statistics.total_features.toLocaleString()}
                  </div>
                  <div className="text-orange-600">Features</div>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="font-medium text-gray-700">Cities:</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {stateData.cities.map((city) => (
                    <div key={city.slug} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                        <span className="font-medium text-gray-800">{city.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">
                          {city.center_lat?.toFixed(4)}, {city.center_lng?.toFixed(4)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {city.statistics.total_features.toLocaleString()} features
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Raw Data Toggle */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <details className="group">
          <summary className="cursor-pointer text-lg font-semibold text-gray-900 hover:text-blue-600">
            Raw API Response (Click to expand)
          </summary>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg overflow-auto max-h-96">
            <pre className="text-xs text-gray-700 whitespace-pre-wrap">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </details>
      </div>
    </div>
  );
} 