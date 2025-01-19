import { kv } from '@vercel/kv';
import {revalidatePath, revalidateTag} from 'next/cache'
import { unstable_cache } from 'next/cache'

export type ActivityIndicatorState = {
  open: null
} | {
  open: boolean
  timestamp: Date
}

/**
 * Builds a ActivityIndicatorState to be stored in KV DB
 * @param open sets the state of the activity indicator
 */
export function buildState(open: boolean | null): ActivityIndicatorState {
  if (open === null) {
    return { open: null }
  }
  return {
    open,
    timestamp: new Date()
  }
}

const getKvState = unstable_cache(
  async () => {
    const state = await kv.get('activityIndicator') as ActivityIndicatorState | null
    return state ?? buildState(null)
  },
  ['activityIndicator'],
  {
    revalidate: 30,
    tags: ['activity-status']
  }
)

/**
 * Queries the KV DB for the current state of the activity indicator
 */
export async function getActivityIndicator(): Promise<ActivityIndicatorState> {
  'use server'
  return getKvState()
}

/**
 * Sets the state of the activity indicator in the KV DB
 * @param state The new activity indicator state
 */
export async function setActivityIndicator(state: ActivityIndicatorState): Promise<void> {
  'use server'
  await kv.set('activityIndicator', state)
  revalidateTag('activity-status')
  revalidatePath('/', 'layout')     // Root layout and its routes
}
