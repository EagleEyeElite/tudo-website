import {kv} from "@vercel/kv";


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
    return {open: null} as ActivityIndicatorState
  }
  return {open: open, timestamp: new Date()} as ActivityIndicatorState;
}


/**
 * Queries the KV DB for the current state of the activity indicator
 */
export async function getActivityIndicator() {
  let state = await kv.get('activityIndicator') as ActivityIndicatorState | null;
  if (state === null) {
    state = buildState(null);
  }
  return state;
}

/**
 * Sets the state of the activity indicator in the KV DB
 * @param state
 */
export async function setActivityIndicator(state: ActivityIndicatorState) {
  await kv.set('activityIndicator', state);
}