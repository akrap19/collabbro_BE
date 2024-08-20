import express from 'express'
import { container } from 'tsyringe'
import { PaymentController } from './paymentController'
import { verifyWebhookSignature } from '../../middleware/verify_webhook/verifyWebhookSignature'

const paymentController = container.resolve(PaymentController)
export const paymentRouter = express.Router()

paymentRouter.post(
  '/webhook',
  verifyWebhookSignature,
  paymentController.getPayPalWebhook
)
