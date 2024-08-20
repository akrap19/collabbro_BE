import { ResponseCode } from '../../interface'
import { AppDataSource } from '../../services/typeorm'
import { Repository } from 'typeorm'
import { logger } from '../../logger'
import { getResponseMessage } from '../../services/utils'
import { autoInjectable } from 'tsyringe'
import { ProjectSkill } from './projectSkillModel'
import { ICreateProjectSkills, IProjectSkillService } from './interface'

@autoInjectable()
export class ProjectSkillService implements IProjectSkillService {
  private readonly projectSkillRepository: Repository<ProjectSkill>

  constructor() {
    this.projectSkillRepository =
      AppDataSource.manager.getRepository(ProjectSkill)
  }

  createProjectSkills = async ({
    projectId,
    skillIds,
    queryRunner
  }: ICreateProjectSkills) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      for (const skillId of skillIds) {
        const insertResult = await this.projectSkillRepository
          .createQueryBuilder('projectSkill', queryRunner)
          .insert()
          .into(ProjectSkill)
          .values([
            {
              projectId,
              skillId
            }
          ])
          .execute()

        if (insertResult.raw.affectedRows !== 1) {
          code = ResponseCode.FAILED_INSERT
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
