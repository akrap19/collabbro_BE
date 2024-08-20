import { ResponseCode } from '../../interface'
import { logger } from '../../logger'
import { getResponseMessage } from '../../services/utils'
import { autoInjectable, container } from 'tsyringe'
import { AppDataSource } from '../../services/typeorm'
import { Skill } from './skillModel'
import { Repository } from 'typeorm'
import {
  ICheckSkill,
  ICreateSkill,
  IHandleSkillsOnboarding,
  ISkillService
} from './interface'
import { UserSkillService } from '../user_skill/userSkillService'

const userSkillService = container.resolve(UserSkillService)

@autoInjectable()
export class SkillService implements ISkillService {
  private readonly skillRepository: Repository<Skill>

  constructor() {
    this.skillRepository = AppDataSource.manager.getRepository(Skill)
  }

  getDefaultSkills = async () => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const defaultSkills = await this.skillRepository.find({
        where: {
          defaultSkill: true
        }
      })

      return { defaultSkills, code }
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

  checkSkill = async ({ skillName, queryRunner }: ICheckSkill) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const skill = await this.skillRepository
        .createQueryBuilder('skill', queryRunner)
        .where('skill = :skillName', { skillName })
        .getOne()

      if (!skill) {
        return { code: ResponseCode.SKILL_NOT_FOUND }
      }

      return { skillId: skill.id, code }
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

  createSkill = async ({ skillName, queryRunner }: ICreateSkill) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const insertResult = await this.skillRepository
        .createQueryBuilder('skill', queryRunner)
        .insert()
        .into(Skill)
        .values([
          {
            skill: skillName,
            defaultSkill: false
          }
        ])
        .execute()

      if (insertResult.raw.affectedRows !== 1) {
        return { code: ResponseCode.FAILED_INSERT }
      }

      return { skillId: insertResult.identifiers[0].id as string, code }
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

  handleSkillsOnboarding = async ({
    userId,
    skills,
    queryRunner
  }: IHandleSkillsOnboarding) => {
    let code: ResponseCode = ResponseCode.OK
    try {
      for (const skillName of skills) {
        let { skillId, code } = await this.checkSkill({
          skillName,
          queryRunner
        })

        if (!skillId) {
          const { skillId: newSkillId, code: skillCode } =
            await this.createSkill({ skillName, queryRunner })

          if (!newSkillId) {
            code = skillCode
            break
          }

          skillId = newSkillId
        }

        const { userSkillId, code: userSkillCode } =
          await userSkillService.createUserSkill({
            userId,
            skillId,
            queryRunner
          })

        if (!userSkillId) {
          code = userSkillCode
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
