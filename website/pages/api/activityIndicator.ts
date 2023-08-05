import {NextApiResponse, NextApiRequest} from 'next'

type ActivityIndicatorState = {
  open: null
} | {
  open: boolean
  timestamp: Date
}

// stores current state of cafe activity
let activityIndicator: ActivityIndicatorState = {open: null}

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

function handlePostReq(req: NextApiRequest, res: NextApiResponse) {
  if (!isAuthenticated(req)) {
    res.status(401).json({error: 'Unauthenticated'})
    return
  }

  try {
    let activityIndicator: ActivityIndicatorState;
    let open = JSON.parse(req.body['open'])
    if (open === null) {
      activityIndicator = {open: null}
    } else {
      activityIndicator = {
        open: JSON.parse(open),
        timestamp: new Date(),
      }
    }
    res.status(200).json(activityIndicator)
    return;
  } catch {
    res.status(400).json({error: "Could not parse boolean key 'open' in body"})
    return
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
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {method} = req

  switch (method) {
    case 'GET':
      res.status(200).json(activityIndicator)
      return
    case 'POST':
      handlePostReq(req, res)
      return
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).json({error: `Method ${method} not allowed`})
      return
  }

}
