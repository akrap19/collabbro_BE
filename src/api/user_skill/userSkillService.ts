import { ResponseCode } from '../../interface'
import { ICreateUserSkill, IUserSkillService } from './interface'
import { AppDataSource } from '../../services/typeorm'
import { Repository } from 'typeorm'
import { logger } from '../../logger'
import { getResponseMessage } from '../../services/utils'
import { autoInjectable } from 'tsyringe'
import { UserSkill } from './userSkillModel'

@autoInjectable()
export class UserSkillService implements IUserSkillService {
  private readonly userSkillRepository: Repository<UserSkill>

  constructor() {
    this.userSkillRepository = AppDataSource.manager.getRepository(UserSkill)
  }

  createUserSkill = async ({
    userId,
    skillId,
    queryRunner
  }: ICreateUserSkill) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const insertResult = await this.userSkillRepository
        .createQueryBuilder('userSkill', queryRunner)
        .insert()
        .into(UserSkill)
        .values([
          {
            userId,
            skillId
          }
        ])
        .execute()

      if (insertResult.raw.affectedRows !== 1) {
        return { code: ResponseCode.FAILED_INSERT }
      }

      return { userSkillId: insertResult.identifiers[0].id as string, code }
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
