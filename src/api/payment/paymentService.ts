import { autoInjectable } from 'tsyringe'
import { createOrder } from '../../services/pay_pal'
import { ResponseCode } from '../../interface'
import { logger } from '../../logger'
import { getResponseMessage } from '../../services/utils'
import { Payment } from './paymentModel'
import { AppDataSource } from '../../services/typeorm'
import {
  ICreatePayment,
  IGetPaymentByAuthId,
  IGetReservedPayments,
  IHandlePayPalWebhook,
  IPaymentService,
  IUpdatePayment,
  PaymentStatus
} from './interface'
import { Repository } from 'typeorm'
import { CollaborationStatus } from '../collaboration/interface'

@autoInjectable()
export class PaymentService implements IPaymentService {
  private readonly paymentRepository: Repository<Payment>

  constructor() {
    this.paymentRepository = AppDataSource.manager.getRepository(Payment)
  }

  createPayment = async ({
    authorizationId,
    paymentStatus,
    amount,
    currencyCode,
    projectId,
    queryRunner
  }: ICreatePayment) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      let insertResult = await this.paymentRepository
        .createQueryBuilder('payment', queryRunner)
        .insert()
        .into(Payment)
        .values([
          {
            authorizationId,
            paymentStatus,
            amount,
            currencyCode,
            projectId
          }
        ])
        .execute()

      if (insertResult.raw.affectedRows !== 1) {
        return { code: ResponseCode.FAILED_INSERT }
      }

      return { code }
    } catch (err: any) {
      code = ResponseCode.SERVER_ERROR
      logger.error({
        code,
        message: getResponseMessage(code),
        stack: err.stack
      })
    }

    return { code }
  }

  updatePayment = async ({
    authorizationId,
    paymentStatus,
    queryRunner
  }: IUpdatePayment) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const payment = await this.paymentRepository
        .createQueryBuilder('payment', queryRunner)
        .where('id = :authorizationId', { authorizationId })
        .getOne()

      if (!payment) {
        return { code: ResponseCode.PAYMENT_NOT_FOUND }
      }

      const paymentEditResult = await this.paymentRepository
        .createQueryBuilder('payment', queryRunner)
        .update(Payment)
        .set({
          paymentStatus
        })
        .where('id = :authorizationId', { authorizationId })
        .execute()

      if (paymentEditResult.affected !== 1) {
        return { code: ResponseCode.FAILED_UPDATE }
      }

      return { code }
    } catch (err: any) {
      code = ResponseCode.SERVER_ERROR
      logger.error({
        code,
        message: getResponseMessage(code),
        stack: err.stack
      })
    }

    return { code }
  }

  getPaymentByAuthId = async ({ authorizationId }: IGetPaymentByAuthId) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const payment = await this.paymentRepository.findOne({
        where: {
          authorizationId
        }
      })

      if (payment === null) {
        return { code: ResponseCode.PAYMENT_NOT_FOUND }
      }

      return { payment, code }
    } catch (err: any) {
      code = ResponseCode.SERVER_ERROR
      logger.error({
        code,
        message: getResponseMessage(code),
        stack: err.stack
      })
    }

    return { code }
  }

  handlePayPalWebhook = async ({ event }: IHandlePayPalWebhook) => {
    let code: ResponseCode = ResponseCode.OK
    const queryRunner = AppDataSource.createQueryRunner()

    try {
      const authorizationId = event.resource.id
      const { payment, code: paymentCode } = await this.getPaymentByAuthId({
        authorizationId
      })

      if (!payment) {
        return { code: paymentCode }
      }

      const { project } = payment

      switch (event.event_type) {
        case 'PAYMENT.AUTHORIZATION.VOID':
          console.log('Authorization expired:', event)
          await queryRunner.connect()
          await queryRunner.startTransaction()
          const { data, code: createOrderCode } = await createOrder(
            project.currencyCode,
            project.totalAmount
          )
          if (createOrderCode !== ResponseCode.OK) {
            await queryRunner.rollbackTransaction()
            await queryRunner.release()
            return { code: createOrderCode }
          }
          const { code: createPaymentCode } = await this.createPayment({
            authorizationId: data.id,
            paymentStatus: PaymentStatus.RESERVED,
            amount: Number(payment.amount),
            currencyCode: payment.currencyCode,
            projectId: payment.projectId,
            queryRunner
          })
          if (createPaymentCode !== ResponseCode.OK) {
            await queryRunner.rollbackTransaction()
            await queryRunner.release()
            return { code: createPaymentCode }
          }
          const { code: updatePaymentCode } = await this.updatePayment({
            authorizationId,
            paymentStatus: PaymentStatus.EXPIRED,
            queryRunner
          })
          if (updatePaymentCode !== ResponseCode.OK) {
            await queryRunner.rollbackTransaction()
            await queryRunner.release()
            return { code: updatePaymentCode }
          }
          break
        default:
          console.log('Unhandled event type:', event.event_type)
      }

      return { code }
    } catch (err: any) {
      code = ResponseCode.SERVER_ERROR
      logger.error({
        code,
        message: getResponseMessage(code),
        stack: err.stack
      })
    }

    return { code }
  }

  getReservedPayments = async ({
    payments,
    collaborationStatus,
    paymentStatus
  }: IGetReservedPayments) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const paymentArray = payments.filter((payment) => {
        return payment.paymentStatus === paymentStatus
      })

      if (paymentArray.length > 1) {
        if (paymentStatus !== PaymentStatus.EXPIRED) {
          return { code: ResponseCode.PAYMENT_ALREADY_EXIST }
        }
      }

      if (paymentArray.length === 1) {
        if (collaborationStatus === CollaborationStatus.REQUEST_APPROVED) {
          return { code: ResponseCode.RESERVED_PAYMENT_ALREADY_EXIST }
        }
        if (
          collaborationStatus ===
          CollaborationStatus.COLLABORATION_FINISHED_SUCCESSFULLY
        ) {
          return { code: ResponseCode.CAPTURED_PAYMENT_ALREADY_EXIST }
        }
      }

      if (paymentArray.length < 1) {
        if (
          collaborationStatus === CollaborationStatus.COLLABORATION_TERMINATED
        ) {
          return { code: ResponseCode.NO_RESERVED_TRANSACTION }
        }
      }

      return { payment: paymentArray[0], code }
    } catch (err: any) {
      code = ResponseCode.SERVER_ERROR
      logger.error({
        code,
        message: getResponseMessage(code),
        stack: err.stack
      })
    }

    return { code }
  }
}
