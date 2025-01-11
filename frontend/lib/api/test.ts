import {ActivityIndicatorState} from "@/lib/api/activityIndicator";

/**
 * Builds a ActivityIndicatorState to be stored in KV DB
 * @param open sets the state of the activity indicator
 */
export default function buildState(open: boolean | null): ActivityIndicatorState {
  if (open === null) {
    return {open: null} as ActivityIndicatorState
  }
  return {open: open, timestamp: new Date()} as ActivityIndicatorState;
}
