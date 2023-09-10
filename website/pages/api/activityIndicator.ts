import {NextApiRequest, NextApiResponse} from 'next'
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
function buildState(open: boolean): ActivityIndicatorState {
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

function isAuthenticated(req: NextApiRequest) {
  const userAuth = process.env.ACTIVITY_INDICATOR_USER;
  const pwdAuth = process.env.ACTIVITY_INDICATOR_PASSWORD;
  const basicAuth = req.headers.authorization

  if (!basicAuth) {
    return false
  }
  if ("" === userAuth || "" === pwdAuth) {
    return false
  }
  const authValue = basicAuth.split(' ')[1]
  const [user, pwd] = Buffer.from(authValue, 'base64').toString().split(':')

  return user === userAuth && pwd === pwdAuth
}

async function handlePostReq(req: NextApiRequest, res: NextApiResponse) {
  if (!isAuthenticated(req)) {
    res.status(401).json({error: 'Unauthenticated'})
    return
  }
  try {
    const open = JSON.parse(req.body['open']) as boolean
    let state = buildState(open);
    await setActivityIndicator(state)
    res.status(200).json(state)
  } catch (e){
    if (e instanceof SyntaxError) {
      res.status(400).json({error: "Could not parse boolean key 'open' in body"})
      return;
    }
    throw e;
  }
}


/**
 * Handler for the activity indicator API
 *
 * GET: returns the current state of the activity indicator
 * POST: sets the current state of the activity indicator
 *     requires basic authentication
 *     requires a JSON body with a boolean key 'open'
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const {method} = req
    switch (method) {
      case 'GET':
        const state = await getActivityIndicator()
        res.status(200).json(state)
        return
      case 'POST':
        await handlePostReq(req, res)
        return
      default:
        res.setHeader('Allow', ['GET', 'POST'])
        res.status(405).json({error: `Method ${method} not allowed`})
        return
    }
  } catch (e) {
    console.log(e, e.stack)
    res.status(500).json({error: e})
  }
}
