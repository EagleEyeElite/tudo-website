'use client';
import React from 'react';
import {formatDistance, formatDistanceToNow } from 'date-fns';
import { ActivityIndicatorState } from '@/lib/api/activityIndicator';
import useSWR from 'swr';

interface OpenStatusProps {
  fetchFnAction: () => Promise<ActivityIndicatorState>;
  initialData: ActivityIndicatorState;
}

export default function OpenStatusClient({ fetchFnAction, initialData}: OpenStatusProps) {
  const { data, error } = useSWR('open-status', fetchFnAction, {
    refreshInterval: 5 * 60 * 1000,  // Poll every 5 minutes
    revalidateOnFocus: true,         // Fetch when tab is focused
    revalidateOnReconnect: true,     // Fetch when internet reconnects
    keepPreviousData: true,          // Show old data while fetching new
    revalidateOnMount: true,         // Fetch fresh data on navigation/mount
    fallbackData: initialData        // Use server data initially
  });

  const status = data?.open === true ? 'Open' : data?.open === false ? 'Closed' : 'Unknown';
  const bgColor = data?.open === true ? 'bg-green-50' : data?.open === false ? 'bg-red-50' : 'bg-gray-50';
  const borderColor = data?.open === true ? 'border-green-200' : data?.open === false ? 'border-red-200' : 'border-gray-200';
  const highlightColor = data?.open === true ? 'text-green-600' : data?.open === false ? 'text-red-600' : 'text-gray-600';

  let timeAgo = 'N/A';
  if ('timestamp' in data && data.timestamp) {
    const now = performance.timeOrigin + performance.now();
    timeAgo = formatDistance(data.timestamp, now, { addSuffix: true });
  }

  return (
    <div className={`p-4 rounded-lg shadow-sm ${bgColor} ${borderColor} border`}>
      <h2 className="font-semibold text-3xl mt-12 mb-4 leading-snug text-black">Activity Status</h2>
      <p className="mb-1 my-6 text-black">
        Status: <span className={`font-bold ${highlightColor}`}>{status}</span>
      </p>
      <p className="text-sm my-6 text-black">
        {status !== 'Unknown' ? `updated ${timeAgo}` : 'No timestamp available'}
      </p>
    </div>
  );
}
