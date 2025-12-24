import React, { useState, useEffect } from 'react';
import { analyticsApi } from '../../apis/analyticsApi';

export default function Analytics({ userID }) {
  const [frequentHour, setFrequentHour] = useState(null);
  const [topBookers, setTopBookers] = useState(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAnalytics } = analyticsApi();

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        const data = await getAnalytics(userID);
        setFrequentHour(data.frequent_hour);
        setTopBookers(data.top_bookers || []);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    if (userID) loadAnalytics();
  }, [userID]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-800">
        <p className="font-semibold">Error Loading Analytics</p>
        <p className="text-sm mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full">

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Peak Hour */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-8 border border-blue-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-2">Peak Hour</p>
              <h3 className="text-3xl font-bold text-blue-600">
                {frequentHour || 'N/A'}
              </h3>
            </div>
            <span className="text-4xl">⏰</span>
          </div>
          <p className="text-blue-700 text-sm">Most frequently booked time</p>
        </div>

        {/* Total Bookers */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-md p-8 border border-purple-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-2">Bookers</p>
              <h3 className="text-3xl font-bold text-purple-600">
                {topBookers?.length || 0}
              </h3>
            </div>
            <span className="text-4xl">👥</span>
          </div>
          <p className="text-purple-700 text-sm">Unique users who booked appointments</p>
        </div>

        {/* Last Updated */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md p-8 border border-green-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-2">Updated</p>
              <h3 className="text-2xl font-bold text-green-600">Today</h3>
            </div>
            <span className="text-4xl">✨</span>
          </div>
          <p className="text-green-700 text-sm">Real-time analytics data</p>
        </div>
      </div>

      {/* Top Bookers Section */}
      {topBookers && topBookers.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <h3 className="text-2xl font-bold text-white">Top Bookers</h3>
            <p className="text-indigo-100 mt-1">Users who book with you most frequently</p>
          </div>

          <div className="divide-y divide-gray-200">
            {topBookers.map((booker, idx) => (
              <div key={idx} className="px-8 py-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center font-bold text-indigo-600">
                      #{idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{booker.name}</p>
                      <p className="text-sm text-gray-500">Total bookings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-indigo-600">{booker.count}</p>
                    <div className="w-32 h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                        style={{
                          width: `${(booker.count / (topBookers[0]?.count || 1)) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Data State */}
      {(!topBookers || topBookers.length === 0) && !frequentHour && (
        <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-600 text-lg mb-2">📈 No analytics data yet</p>
          <p className="text-gray-500">Start booking appointments to see your analytics data appear here</p>
        </div>
      )}
    </div>
  );
}
