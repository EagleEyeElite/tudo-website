'use server'

import {kv} from "@vercel/kv";
import { unstable_cacheLife as cacheLife } from "next/cache";
import { unstable_cacheTag as cacheTag } from 'next/cache'
import { revalidateTag } from 'next/cache'
import buildState from "@/lib/api/test";


export type ActivityIndicatorState = {
  open: null
} | {
  open: boolean
  timestamp: Date
}



/**
 * Queries the KV DB for the current state of the activity indicator
 */
export async function getActivityIndicator() {
  'use cache'
  cacheLife({
    revalidate: 1,
    expire: Infinity,
  })
  cacheTag('activityIndicator')


  let state = await kv.get('activityIndicator') as ActivityIndicatorState | null;
  if (state === null) {
    return buildState(null);
  }
  return state;
}

/**
 * Sets the state of the activity indicator in the KV DB
 * @param state
 */
export async function setActivityIndicator(state: ActivityIndicatorState) {
  'use server'
  await kv.set('activityIndicator', state);
  revalidateTag('activityIndicator')
}
