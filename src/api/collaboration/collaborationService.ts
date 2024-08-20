import { ResponseCode } from '../../interface'
import { logger } from '../../logger'
import { getResponseMessage } from '../../services/utils'
import { autoInjectable, container } from 'tsyringe'
import { AppDataSource } from '../../services/typeorm'
import { Collaboration } from './collaborationModel'
import { Repository } from 'typeorm'
import {
  ICrateCollaboration,
  ICollaborationService,
  IUpdateCollaboration,
  CollaborationStatus
} from './interface'
import { ProjectService } from '../project/projectService'
import { NotificationType } from '../notification/interface'
import { NotificationService } from '../notification/notificationService'
import { ActivityType } from '../activity/interface'
import { ActivityService } from '../activity/activityService'
import {
  capturePayment,
  createOrder,
  voidAuthorization
} from '../../services/pay_pal'
import { PaymentService } from '../payment/paymentService'
import { PaymentStatus } from '../payment/interface'

const projectService = container.resolve(ProjectService)
const notificationService = container.resolve(NotificationService)
const activityService = container.resolve(ActivityService)
const paymentService = container.resolve(PaymentService)

@autoInjectable()
export class CollaborationService implements ICollaborationService {
  private readonly collaborationRepository: Repository<Collaboration>

  constructor() {
    this.collaborationRepository =
      AppDataSource.manager.getRepository(Collaboration)
  }

  createCollaboration = async ({
    projectId,
    collaboratorId,
    amount
  }: ICrateCollaboration) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const { project, code } = await projectService.getProjectById({
        projectId
      })

      if (!project) {
        return { code: ResponseCode.PROJECT_NOT_FOUND }
      }

      const collaboration = {
        collaboratorId,
        ownerId: project.userId,
        collaborationStatus: CollaborationStatus.REQUEST_SENT,
        amount
      }

      const newCollaboration =
        await this.collaborationRepository.save(collaboration)

      if (!newCollaboration) {
        return { code: ResponseCode.FAILED_INSERT }
      }

      const message = `${project.user.email} wants to collaborate with you!`

      await notificationService.createNotification({
        message,
        receiverId: newCollaboration.ownerId,
        type: NotificationType.ADDED_TO_FAVORITES,
        senderId: collaboratorId
      })

      return { newCollaboration, code }
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

  updateCollaboration = async ({
    collaborationId,
    ownerId,
    collaborationStatus,
    profileHandle
  }: IUpdateCollaboration) => {
    let code: ResponseCode = ResponseCode.OK
    const queryRunner = AppDataSource.createQueryRunner()

    try {
      const collaboration = await this.collaborationRepository.findOne({
        where: {
          ownerId,
          id: collaborationId
        }
      })

      if (collaboration === null) {
        return { code: ResponseCode.COLLABORATION_NOT_FOUND }
      }

      await queryRunner.connect()
      await queryRunner.startTransaction()

      const { payments } = collaboration

      switch (collaborationStatus) {
        case CollaborationStatus.COLLABORATION_FINISHED_SUCCESSFULLY:
          const { payment: reservedPayment, code: checkPaymentCodeOnFinish } =
            await paymentService.getReservedPayments({
              payments,
              collaborationStatus,
              paymentStatus: PaymentStatus.CAPTURED
            })

          if (!reservedPayment) {
            await queryRunner.rollbackTransaction()
            await queryRunner.release()
            return { code: checkPaymentCodeOnFinish }
          }
          const { data: orderData, code: orderCode } = await capturePayment(
            reservedPayment.authorizationId,
            reservedPayment.currencyCode,
            collaboration.amount
          )
          if (orderCode !== ResponseCode.OK) {
            await queryRunner.rollbackTransaction()
            await queryRunner.release()
            return { code: orderCode }
          }
          const { code: paymentCode } = await paymentService.updatePayment({
            authorizationId: reservedPayment.authorizationId,
            paymentStatus: PaymentStatus.CAPTURED,
            queryRunner
          })

          if (paymentCode !== ResponseCode.OK) {
            await queryRunner.rollbackTransaction()
            await queryRunner.release()
            return { code: paymentCode }
          }
          const { code: activityCode } = await activityService.createActivity({
            userId: ownerId,
            profileHandle,
            projectId: collaboration.project.id,
            activityType: ActivityType.CREATE_PROJECT,
            queryRunner
          })
          if (activityCode !== ResponseCode.OK) {
            await queryRunner.rollbackTransaction()
            await queryRunner.release()
            return { code: activityCode }
          }
          break
        case CollaborationStatus.REQUEST_APPROVED:
          if (payments.length !== 0) {
            await queryRunner.rollbackTransaction()
            await queryRunner.release()
            return { code: ResponseCode.PAYMENT_ALREADY_EXIST }
          }

          const { data: newOrder, code: newOrderCode } = await createOrder(
            collaboration.project.currencyCode,
            collaboration.amount
          )
          if (newOrderCode !== ResponseCode.OK) {
            await queryRunner.rollbackTransaction()
            await queryRunner.release()
            return { code: newOrderCode }
          }
          const { code: createPaymentCode } =
            await paymentService.createPayment({
              authorizationId: newOrder.id,
              paymentStatus: PaymentStatus.RESERVED,
              amount: collaboration.amount,
              currencyCode: collaboration.project.currencyCode,
              projectId: collaboration.projectId,
              queryRunner
            })
          if (createPaymentCode !== ResponseCode.OK) {
            await queryRunner.rollbackTransaction()
            await queryRunner.release()
            return { code: createPaymentCode }
          }
          break
        case CollaborationStatus.COLLABORATION_TERMINATED:
          const { payment, code: checkPaymentCodeOnTermination } =
            await paymentService.getReservedPayments({
              payments,
              collaborationStatus,
              paymentStatus: PaymentStatus.VOID
            })

          if (!payment) {
            await queryRunner.rollbackTransaction()
            await queryRunner.release()
            return { code: checkPaymentCodeOnTermination }
          }
          const { data: voidedOrder, code: voidOrderCode } =
            await voidAuthorization(payment.authorizationId)
          if (voidOrderCode !== ResponseCode.OK) {
            await queryRunner.rollbackTransaction()
            await queryRunner.release()
            return { code: voidOrderCode }
          }
          const { code: termnitedPaymentCode } =
            await paymentService.updatePayment({
              authorizationId: payment.authorizationId,
              paymentStatus: PaymentStatus.VOID,
              queryRunner
            })
          if (termnitedPaymentCode !== ResponseCode.OK) {
            await queryRunner.rollbackTransaction()
            await queryRunner.release()
            return { code: termnitedPaymentCode }
          }
          break
        default:
          break
      }
      collaboration.collaborationStatus = collaborationStatus

      const updateResult = await this.collaborationRepository
        .createQueryBuilder('collaboration', queryRunner)
        .update(Collaboration)
        .set({
          collaborationStatus
        })
        .where('collaboration.id = :collaborationId', { collaborationId })
        .execute()

      if (updateResult.raw.affectedRows !== 1) {
        await queryRunner.rollbackTransaction()
        await queryRunner.release()
        return { code: ResponseCode.FAILED_UPDATE }
      }

      await queryRunner.commitTransaction()
      await queryRunner.release()

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
}
