'use client';
import { ActivityIndicatorState } from "@/lib/api/activityIndicator";
import React from "react";
import { CustomLink } from "../ui/links";
import { OPENING_HOURS_PATH } from "@/lib/constants";
import useSWR from 'swr';
import {OpenButton} from "@/components/ui/open-button";

interface OpenClosedIndicatorProps {
  fetchFnAction: () => Promise<ActivityIndicatorState>;
  initialData: ActivityIndicatorState;
}

export default function ActivityIndicator({ fetchFnAction, initialData }: OpenClosedIndicatorProps) {
  const { data } = useSWR('activity-status', fetchFnAction, {
    refreshInterval: 5 * 60 * 1000,  // Poll every 5 minutes
    revalidateOnFocus: true,         // Fetch when tab is focused
    revalidateOnReconnect: true,     // Fetch when internet reconnects
    keepPreviousData: true,          // Show old data while fetching new
    revalidateOnMount: true,         // Fetch fresh data on navigation/mount
    fallbackData: initialData        // Use server data initially
  });

  const isOpen = data?.open ?? false;

  return isOpen ?
    <OpenButton /> :
    <CustomLink link={{text: "Öffnungszeiten", href: OPENING_HOURS_PATH, highlighted: true}} />;
}
