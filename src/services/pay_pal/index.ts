import fetch from 'node-fetch'
import 'dotenv/config'
import config from '../../config'
import { ResponseCode, ResponseMessage } from '../../interface'
import { logger } from '../../logger'

const payPalURL = config.PAY_PAL_URL

export const generateAccessToken = async () => {
  let code: ResponseCode = ResponseCode.OK
  try {
    const auth = Buffer.from(
      config.PAY_PAL_CLIENT_ID + ':' + config.PAY_PAL_CLIENT_ID
    ).toString('base64')
    const response = await fetch(`${payPalURL}/v1/oauth2/token`, {
      method: 'POST',
      body: 'grant_type=client_credentials',
      headers: {
        Authorization: `Basic ${auth}`
      }
    })

    const data: any = await response.json()
    return {
      accessToken: data.access_token,
      code
    }
  } catch (err: any) {
    logger.error({
      code: ResponseCode.FAILED_DEPENDENCY,
      message: ResponseMessage.FAILED_DEPENDENCY,
      stack: err.stack
    })
    return { code: ResponseCode.FAILED_DEPENDENCY }
  }
}

// Create an order with authorization intent - funds reservations
export const createOrder = async (currencyCode: string, amount: number) => {
  let code: ResponseCode = ResponseCode.OK
  try {
    const accessToken = await generateAccessToken()
    const response = await fetch(`${payPalURL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        intent: 'AUTHORIZE',
        purchase_units: [
          {
            amount: {
              currency_code: currencyCode,
              value: String(amount)
            }
          }
        ]
      })
    })

    const data: any = await response.json()
    return { data, code }
  } catch (err: any) {
    logger.error({
      code: ResponseCode.FAILED_DEPENDENCY,
      message: ResponseMessage.FAILED_DEPENDENCY,
      stack: err.stack
    })
    return { code: ResponseCode.FAILED_DEPENDENCY }
  }
}

// Capture the payment previously authorized - funds trasferred to merchant (collabro in our case)
export const capturePayment = async (
  authorizationId: string,
  currencyCode: string,
  amount: number
) => {
  let code: ResponseCode = ResponseCode.OK
  try {
    const accessToken = await generateAccessToken()
    const response = await fetch(
      `${payPalURL}/v2/payments/authorizations/${authorizationId}/capture`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: {
            currency_code: currencyCode,
            value: String(amount)
          }
        })
      }
    )

    const data = await response.json()
    return { data, code }
  } catch (err: any) {
    logger.error({
      code: ResponseCode.FAILED_DEPENDENCY,
      message: ResponseMessage.FAILED_DEPENDENCY,
      stack: err.stack
    })
    return { code: ResponseCode.FAILED_DEPENDENCY }
  }
}

// Releases the reserved funds back to the payer's account before the authorization naturally expires (29 days max)
export const voidAuthorization = async (authorizationId: string) => {
  let code: ResponseCode = ResponseCode.OK
  try {
    const accessToken = await generateAccessToken()
    const response = await fetch(
      `https://api.sandbox.paypal.com/v2/payments/authorizations/${authorizationId}/void`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )

    const data = await response.json()
    return { data, code }
  } catch (err: any) {
    logger.error({
      code: ResponseCode.FAILED_DEPENDENCY,
      message: ResponseMessage.FAILED_DEPENDENCY,
      stack: err.stack
    })
    return { code: ResponseCode.FAILED_DEPENDENCY }
  }
}

export const reauthorizePayment = async (
  authorizationId: string,
  currencyCode: string,
  amount: number
) => {
  let code: ResponseCode = ResponseCode.OK
  try {
    const accessToken = await generateAccessToken()
    const response = await fetch(
      `https://api.sandbox.paypal.com/v2/payments/authorizations/${authorizationId}/reauthorize`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: {
            currency_code: currencyCode,
            value: String(amount)
          }
        })
      }
    )

    const data = await response.json()
    return { data, code }
  } catch (err: any) {
    logger.error({
      code: ResponseCode.FAILED_DEPENDENCY,
      message: ResponseMessage.FAILED_DEPENDENCY,
      stack: err.stack
    })
    return { code: ResponseCode.FAILED_DEPENDENCY }
  }
}
