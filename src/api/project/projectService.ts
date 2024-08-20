import { ResponseCode } from '../../interface'
import { logger } from '../../logger'
import { getResponseMessage } from '../../services/utils'
import { autoInjectable, container, delay, inject } from 'tsyringe'
import { AppDataSource } from '../../services/typeorm'
import { Repository } from 'typeorm'
import {
  IAddProjectView,
  IConditions,
  ICreateProject,
  IGetProjectById,
  IGetProjects,
  IProjectService
} from './interface'
import { Project } from './projectModel'
import { MediaService } from '../media/mediaService'
import { ProjectSkillService } from '../project_skill/projectSkillService'
import { ProjectInstrumentService } from '../project_instrument/projectInstrumentService'
import { ActivityService } from '../activity/activityService'
import { ActivityType } from '../activity/interface'

const projectInstrumentService = container.resolve(ProjectInstrumentService)
const projectSkillService = container.resolve(ProjectSkillService)
const mediaService = container.resolve(MediaService)
const activityService = container.resolve(ActivityService)

@autoInjectable()
export class ProjectService implements IProjectService {
  private readonly projectRepository: Repository<Project>

  constructor() {
    this.projectRepository = AppDataSource.manager.getRepository(Project)
  }

  createProject = async ({
    userId,
    storageUsage,
    name,
    description,
    projectType,
    deadline,
    paid,
    tags,
    currencyCode,
    totalAmount,
    instrumentIds,
    skills,
    mediaFiles,
    profileHandle
  }: ICreateProject) => {
    let code: ResponseCode = ResponseCode.OK
    const queryRunner = AppDataSource.createQueryRunner()

    try {
      const checkSize = mediaFiles.reduce(
        (total, file) => total + file.fileSize,
        0
      )

      if (storageUsage + checkSize > 5000) {
        return { code: ResponseCode.USER_LIMIT_REACHED }
      }

      await queryRunner.connect()
      await queryRunner.startTransaction()

      const insertResult = await this.projectRepository
        .createQueryBuilder('project', queryRunner)
        .insert()
        .into(Project)
        .values([
          {
            userId,
            name,
            description,
            projectType,
            deadline,
            paid,
            tags,
            currencyCode,
            totalAmount
          }
        ])
        .execute()

      if (insertResult.raw.affectedRows !== 1) {
        await queryRunner.rollbackTransaction()
        await queryRunner.release()
        return { code: ResponseCode.FAILED_INSERT }
      }

      const projectId = insertResult.identifiers[0].id

      const project = await this.projectRepository
        .createQueryBuilder('project', queryRunner)
        .where('project.id = :projectId', { projectId })
        .getOne()

      if (!project) {
        await queryRunner.rollbackTransaction()
        await queryRunner.release()
        return { code: ResponseCode.PROJECT_NOT_FOUND }
      }

      const { code: instrumentCode } =
        await projectInstrumentService.createProjectInstruments({
          projectId,
          instrumentIds,
          queryRunner
        })
      if (instrumentCode !== ResponseCode.OK) {
        await queryRunner.rollbackTransaction()
        await queryRunner.release()
        return { code: instrumentCode }
      }
      const { code: skillode } = await projectSkillService.createProjectSkills({
        projectId,
        skills,
        queryRunner
      })
      if (skillode !== ResponseCode.OK) {
        await queryRunner.rollbackTransaction()
        await queryRunner.release()
        return { code: skillode }
      }
      const { mediaInfo, code: mediaCode } =
        await mediaService.createMediaEntries({
          projectId,
          mediaFiles,
          queryRunner
        })
      if (mediaCode !== ResponseCode.OK) {
        await queryRunner.rollbackTransaction()
        await queryRunner.release()
        return { code: mediaCode }
      }

      const { code: activityCode } = await activityService.createActivity({
        userId,
        profileHandle,
        projectId,
        activityType: ActivityType.CREATE_PROJECT,
        queryRunner
      })

      if (activityCode !== ResponseCode.OK) {
        await queryRunner.rollbackTransaction()
        await queryRunner.release()
        return { code: activityCode }
      }

      await queryRunner.commitTransaction()
      await queryRunner.release()

      return { mediaInfo, code }
    } catch (err: any) {
      await queryRunner.rollbackTransaction()
      await queryRunner.release()
      code = ResponseCode.SERVER_ERROR
      logger.error({
        code,
        message: getResponseMessage(code),
        stack: err.stack
      })
    }

    return { code }
  }

  getProjects = async ({
    type,
    genre,
    skill,
    instrument,
    profession,
    page,
    perPage
  }: IGetProjects) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const offset = (page - 1) * perPage

      const conditions: IConditions = {
        skip: offset,
        take: perPage
      }

      if (type) {
        conditions.where!.projectType = type
      }

      if (genre) {
        conditions.where!.genre!.genre = genre
      }

      if (skill) {
        conditions.where!.skill!.skill = skill
      }

      if (instrument) {
        conditions.where!.instrument!.instrument = instrument
      }

      if (profession) {
        conditions.where!.profession!.profession = profession
      }

      const projects = await this.projectRepository.find(conditions)

      return { projects, code }
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

  getProjectById = async ({ projectId }: IGetProjectById) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const project = await this.projectRepository.findOne({
        where: {
          id: projectId
        }
      })

      if (project === null) {
        return { code: ResponseCode.PROJECT_NOT_FOUND }
      }

      return { project, code }
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

  addProjectView = async ({ projectId }: IAddProjectView) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const project = await this.projectRepository.findOne({
        where: {
          id: projectId
        }
      })

      if (project === null) {
        return { code: ResponseCode.PROJECT_NOT_FOUND }
      }

      project.views = project.views + 1

      const updatedProject = await this.projectRepository.save(project)

      return { project: updatedProject, code }
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
