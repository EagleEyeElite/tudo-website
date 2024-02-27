import request from "supertest";

const baseURL = process.env.NEXT_PUBLIC_URL
const apiEndpoint = "/api/activityIndicator"

const userAuth = process.env.ACTIVITY_INDICATOR_USER
const pwdAuth = process.env.ACTIVITY_INDICATOR_PASSWORD
const encodedCredentials = Buffer.from(`${userAuth}:${pwdAuth}`).toString('base64')

function datesEqualRoughly(date1: Date, date2: Date): boolean {
  const timeDifferenceInMillis = Math.abs(date1.getTime() - date2.getTime())
  return timeDifferenceInMillis <= 1000
}

function postRequest(setOpen: boolean) {
  return request(baseURL)
    .post(apiEndpoint)
    .send({open: setOpen})
    .set('Authorization', `Basic ${encodedCredentials}`)
}

async function checkPostRequest(setOpen: boolean) {
  const time = new Date()
  const response = await postRequest(setOpen)
  const body = response.body
  const timeResponse = new Date(body.timestamp)

  expect(response.statusCode).toBe(200)
  expect(datesEqualRoughly(time, timeResponse)).toBeTruthy()
  expect(response.body.open).toBe(setOpen)
}

describe('ActivityIndicatorAPI', () => {
  beforeEach(async () => {
    await postRequest(null)
  })

  it('should return default state', async () => {
    const response = await request(baseURL).get(apiEndpoint)
    expect(response.statusCode).toBe(200)
    expect(response.body).toStrictEqual({"open": null})
  })
  it('should update to the open state', async () => {
    await checkPostRequest(true)
    const response = await request(baseURL).get(apiEndpoint)
    expect(response.statusCode).toBe(200)
    expect(response.body.open).toBeTruthy()
  })
  it('should update to the close state', async () => {
    await checkPostRequest(false)
    const response = await request(baseURL).get(apiEndpoint)
    expect(response.statusCode).toBe(200)
    expect(response.body.open).not.toBeTruthy()
  })
  it('should throw an error on unauthenticated post request', async () => {
    const response = await request(baseURL)
      .post(apiEndpoint)
      .send({open: false})
    expect(response.statusCode).toBe(401)
    expect(response.body).toStrictEqual({"error": "Unauthenticated"})
  })
  it('should throw an error on disallowed method', async () => {
    const response = await request(baseURL)
      .put(apiEndpoint)
      .send({open: false})
    expect(response.statusCode).toBe(405)
    expect(response.body).toStrictEqual({error: `Method PUT not allowed`})
  })
})
