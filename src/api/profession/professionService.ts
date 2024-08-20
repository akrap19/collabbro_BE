import { ResponseCode } from '../../interface'
import { logger } from '../../logger'
import { getResponseMessage } from '../../services/utils'
import { autoInjectable, container } from 'tsyringe'
import { AppDataSource } from '../../services/typeorm'
import { Profession } from './professionModel'
import { Repository } from 'typeorm'
import {
  ICheckProfession,
  ICreateProfession,
  IHandleProfessionsOnboarding,
  IProfessionService
} from './interface'
import { UserProfessionService } from '../user_profession/userrProfessionService'

const userProfessionService = container.resolve(UserProfessionService)

@autoInjectable()
export class ProfessionService implements IProfessionService {
  private readonly professionRepository: Repository<Profession>

  constructor() {
    this.professionRepository = AppDataSource.manager.getRepository(Profession)
  }

  getDefaultProfessions = async () => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const defaultProfessions = await this.professionRepository.find({
        where: {
          defaultProfession: true
        }
      })

      return { defaultProfessions, code }
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

  checkProfession = async ({
    professionName,
    queryRunner
  }: ICheckProfession) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const profession = await this.professionRepository
        .createQueryBuilder('profession', queryRunner)
        .where('profession = :professionName', { professionName })
        .getOne()

      if (!profession) {
        return { code: ResponseCode.PROFESSION_NOT_FOUND }
      }

      return { professionId: profession.id, code }
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

  createProfession = async ({
    professionName,
    queryRunner
  }: ICreateProfession) => {
    let code: ResponseCode = ResponseCode.OK
    try {
      const insertResult = await this.professionRepository
        .createQueryBuilder('profession', queryRunner)
        .insert()
        .into(Profession)
        .values([
          {
            profession: professionName,
            defaultProfession: false
          }
        ])
        .execute()

      if (insertResult.raw.affectedRows !== 1) {
        return { code: ResponseCode.FAILED_INSERT }
      }

      return { professionId: insertResult.identifiers[0].id as string, code }
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

  handleProffesionsOnboarding = async ({
    userId,
    professions,
    queryRunner
  }: IHandleProfessionsOnboarding) => {
    let code: ResponseCode = ResponseCode.OK
    try {
      for (const professionName of professions) {
        let { professionId, code } = await this.checkProfession({
          professionName,
          queryRunner
        })

        if (!professionId) {
          const { professionId: newProfessionId, code: professionCode } =
            await this.createProfession({ professionName, queryRunner })

          if (!newProfessionId) {
            code = professionCode
            break
          }

          professionId = newProfessionId
        }

        const { userProfessionId, code: userProfessionCode } =
          await userProfessionService.createUserProfession({
            userId,
            professionId,
            queryRunner
          })

        if (!userProfessionId) {
          code = userProfessionCode
          break
        }
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
}
