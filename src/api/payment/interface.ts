import { AsyncResponse, IServiceMethod, ResponseCode } from '../../interface'
import { CollaborationStatus } from '../collaboration/interface'
import { Payment } from './paymentModel'

export enum PaymentStatus {
  CAPTURED = 'Captured',
  VOID = 'Void',
  RESERVED = 'Reserved',
  EXPIRED = 'Expired'
}

export interface IGetPaymentByAuthId {
  authorizationId: string
}

export interface IHandlePayPalWebhook {
  event: PayPalWebhookEvent
}

export interface ICreatePayment extends IServiceMethod {
  authorizationId: string
  paymentStatus: PaymentStatus
  amount: number
  currencyCode: string
  projectId: string
}

export interface IUpdatePayment extends IServiceMethod {
  authorizationId: string
  paymentStatus: PaymentStatus
}

export interface IGetReservedPayments extends IServiceMethod {
  payments: Payment[]
  collaborationStatus: CollaborationStatus
  paymentStatus: PaymentStatus
}

interface PayPalWebhookEvent {
  event_type: string
  resource: {
    id: string
  }
}

export interface IPaymentService {
  createPayment(param: ICreatePayment): AsyncResponse<ResponseCode>
  updatePayment(param: IUpdatePayment): AsyncResponse<ResponseCode>
  getPaymentByAuthId(param: IGetPaymentByAuthId): AsyncResponse<Payment>
  getReservedPayments(param: IGetReservedPayments): AsyncResponse<Payment>
}
