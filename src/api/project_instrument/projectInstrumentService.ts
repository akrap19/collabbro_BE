import { ResponseCode } from '../../interface'
import { AppDataSource } from '../../services/typeorm'
import { Repository } from 'typeorm'
import { logger } from '../../logger'
import { getResponseMessage } from '../../services/utils'
import { autoInjectable } from 'tsyringe'
import { ProjectInstrument } from './projectInstrumentModel'
import {
  IProjectInstrumentService,
  ICreateProjectInstruments
} from './interface'

@autoInjectable()
export class ProjectInstrumentService implements IProjectInstrumentService {
  private readonly projectInstrumentRepository: Repository<ProjectInstrument>

  constructor() {
    this.projectInstrumentRepository =
      AppDataSource.manager.getRepository(ProjectInstrument)
  }

  createProjectInstruments = async ({
    projectId,
    instrumentIds,
    queryRunner
  }: ICreateProjectInstruments) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      for (const instrumentId of instrumentIds) {
        const insertResult = await this.projectInstrumentRepository
          .createQueryBuilder('projectInstrument', queryRunner)
          .insert()
          .into(ProjectInstrument)
          .values([
            {
              projectId,
              instrumentId
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
