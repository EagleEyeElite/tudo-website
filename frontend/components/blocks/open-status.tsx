import React, { Suspense } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { getActivityIndicator } from "@/lib/api/activityIndicator";
import { unstable_noStore as noStore } from 'next/cache';

async function OpenStatusContent() {
  noStore();
  const data = await getActivityIndicator();

  const status = data.open === true ? 'Open' : data.open === false ? 'Closed' : 'Unknown';
  const bgColor = data.open === true ? 'bg-green-50' : data.open === false ? 'bg-red-50' : 'bg-gray-50';
  const borderColor = data.open === true ? 'border-green-200' : data.open === false ? 'border-red-200' : 'border-gray-200';
  const highlightColor = data.open === true ? 'text-green-600' : data.open === false ? 'text-red-600' : 'text-gray-600';

  let timeAgo = 'N/A';
  if ('timestamp' in data && data.timestamp) {
    const date = new Date(data.timestamp);
    timeAgo = formatDistanceToNow(date, { addSuffix: true });
  }

  return (
    <div className={`p-4 rounded-lg shadow-sm ${bgColor} ${borderColor} border`}>
      <h2 className="text-xl font-semibold mb-2 text-black">Activity Status</h2>
      <p className="mb-1 text-black">
        Status: <span className={`font-bold ${highlightColor}`}>{status}</span>
      </p>
      <p className="text-sm text-black">
        updated {status !== 'Unknown' ? `${timeAgo}` : 'No timestamp available'}
      </p>
    </div>
  );
}

const OpenStatusSkeleton = () => {
  return (
    <div className="p-4 rounded-lg shadow-sm bg-gray-50 border border-gray-200">
      <h2 className="text-xl font-semibold mb-2 text-black">Activity Status</h2>
      <p className="mb-1 text-black">
        Status: <span className="font-bold inline-block w-16 h-6 bg-gray-200 rounded animate-pulse"></span>
      </p>
      <p className="text-sm text-black">
        updated <span className="inline-block w-32 h-4 bg-gray-200 rounded animate-pulse"></span>
      </p>
    </div>
  );
};

export default function OpenStatus() {
  return (
    <Suspense fallback={<OpenStatusSkeleton />}>
      <OpenStatusContent />
    </Suspense>
  );
}
