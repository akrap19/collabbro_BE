import { NextFunction, Request, Response } from 'express'
import { autoInjectable } from 'tsyringe'
import { PaymentService } from './paymentService'

@autoInjectable()
export class PaymentController {
  private readonly paymentService: PaymentService

  constructor(paymentService: PaymentService) {
    this.paymentService = paymentService
  }

  getPayPalWebhook = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { code } = await this.paymentService.handlePayPalWebhook({
      event: req.body
    })

    return next({
      code
    })
  }
}
