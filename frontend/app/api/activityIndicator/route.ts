import {NextRequest, NextResponse} from 'next/server';
import {
  buildState,
  getActivityIndicator,
  setActivityIndicator
} from "lib/api/activityIndicator";

function parseBoolean(value: string | null): boolean | null {
  if (value === null) return null;
  switch (value.toLowerCase()) {
    case 'true': return true;
    case 'false': return false;
    case 'null': return null;
    default: throw new Error(`Invalid boolean string: ${value}`);
  }
}


function isAuthenticated(req: NextRequest) {
  const userAuth = process.env.ACTIVITY_INDICATOR_USER;
  const pwdAuth = process.env.ACTIVITY_INDICATOR_PASSWORD;
  const basicAuth = req.headers.get('authorization');

  if (!basicAuth) {
    return false;
  }
  if ("" === userAuth || "" === pwdAuth) {
    return false;
  }
  const authValue = basicAuth.split(' ')[1];
  const [user, pwd] = Buffer.from(authValue, 'base64').toString().split(':');

  return user === userAuth && pwd === pwdAuth;
}

/**
 * Handler for the activity indicator API
 *
 * GET: returns the current state of the activity indicator
 */
export async function GET() {
  try {
    const state = await getActivityIndicator();
    return NextResponse.json(state, {status: 200});
  } catch (e) {
    console.log(e, e.stack);
    return NextResponse.json({error: e}, {status: 500});
  }
}

/**
 * Handler for the activity indicator API
 *
 * POST: sets the current state of the activity indicator
 *     requires basic authentication
 *     requires a JSON body with a boolean key 'open'
 */
export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({error: 'Unauthenticated'}, {status: 401});
  }
  try {
    const formData = await req.formData();
    const openValue = formData.get('open') as string | null;
    const open = parseBoolean(openValue);
    const state = buildState(open);
    await setActivityIndicator(state);
    return NextResponse.json(state, {status: 200});
  } catch (e) {
    if (e instanceof SyntaxError) {
      return NextResponse.json({error: "Could not parse boolean key 'open' in body"}, {status: 400});
    }
    throw e;
  }
}
