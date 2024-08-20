import { NextFunction, Response, Request } from 'express'
import { ResponseCode, ResponseMessage, StatusCode } from '../../interface'
import { generateAccessToken } from '../../services/pay_pal'
import config from '../../config'

export const verifyWebhookSignature = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = await generateAccessToken()
  const verificationUrl =
    'https://api.sandbox.paypal.com/v1/notifications/verify-webhook-signature'

  const body = {
    auth_algo: req.headers['paypal-auth-algo'],
    cert_url: req.headers['paypal-cert-url'],
    transmission_id: req.headers['paypal-transmission-id'],
    transmission_sig: req.headers['paypal-transmission-sig'],
    transmission_time: req.headers['paypal-transmission-time'],
    webhook_id: config.PAY_PAL_WEBHOOK_ID,
    webhook_event: req.body
  }

  const response = await fetch(verificationUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  const data: any = await response.json()

  if (data.verification_status !== 'SUCCESS') {
    return res.status(StatusCode.UNAUTHORIZED).send({
      data: null,
      code: ResponseCode.PAY_PAL_WEBHOOK_UNAUTHORIZED,
      message: ResponseMessage.PAY_PAL_WEBHOOK_UNAUTHORIZED
    })
  }
  return
}
