'use client';
import {ActivityIndicatorState} from '@/lib/api/activityIndicator';
import React from 'react';
import {CustomLink} from '@/components/ui/links';
import {OPENING_HOURS_PATH} from '@/lib/constants';
import {OpenButton} from '@/components/ui/open-button';
import useSWR from 'swr';
import { usePathname } from 'next/navigation';

interface OpenClosedIndicatorProps {
  initialData: ActivityIndicatorState;
}

export default function ActivityIndicator({ initialData }: OpenClosedIndicatorProps) {
  const pathname = usePathname(); // remove the hover effect on route change

  const { data, error } = useSWR(
    'activity-status',
    async () => {
      const res = await fetch("/api/activityIndicator");
      return await res.json() as ActivityIndicatorState;
    },
    {
      refreshInterval: 5 * 60 * 1000,  // Poll every 5 minutes
      revalidateOnFocus: true,         // Fetch when tab is focused
      revalidateOnReconnect: true,     // Fetch when internet reconnects
      keepPreviousData: true,          // Show old data while fetching new
      revalidateOnMount: true,         // Fetch fresh data on navigation/mount
      fallbackData: initialData        // Use server data initially
    }
  );

  if (error || !data?.open)
    return <CustomLink link={{text: "Öffnungszeiten", href: OPENING_HOURS_PATH, highlighted: true}} key={pathname}/>;

  return <OpenButton key={pathname}/>
}
