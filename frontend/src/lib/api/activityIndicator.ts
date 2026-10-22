import { Redis } from '@upstash/redis';
import { cacheLife, cacheTag, revalidatePath, revalidateTag } from 'next/cache'

const kv = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

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

async function getKvState(): Promise<ActivityIndicatorState> {
  'use cache'
  cacheLife('activityIndicator')
  cacheTag('activity-status')
  const state = await kv.get('activityIndicator') as ActivityIndicatorState | null
  return state ?? buildState(null)
}

/**
 * Queries the KV DB for the current state of the activity indicator
 */
export async function getActivityIndicator(): Promise<ActivityIndicatorState> {
  'use server'
  return getKvState()
}

/**
 * Sets the state of the activity indicator in the KV DB.
 * Not a server action on purpose: only the authenticated API route may call it.
 * @param state The new activity indicator state
 */
export async function setActivityIndicator(state: ActivityIndicatorState): Promise<void> {
  await kv.set('activityIndicator', state)
  revalidateTag('activity-status', { expire: 0 })
  revalidatePath('/', 'layout')     // Root layout and its routes
}
